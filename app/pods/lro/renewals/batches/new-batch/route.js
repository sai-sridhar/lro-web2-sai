import Ember from 'ember';
import RenewalMixin from 'zion/mixins/renewal';

export default Ember.Route.extend(RenewalMixin, {
	model : function() {
		return this.store.findAll("community");
	},

	actions : {
		selectCommunity : function(community) {
			community.toggleProperty("selected");
		},
		selectAll : function() {
			this.controller.set("selectedCommunities", []);
			this.controller.get("model").forEach(function(comm) {
				this.controller.get("selectedCommunities").pushObject(comm);
			}, this);
		},
		deselectAll : function() {
			this.controller.set("selectedCommunities", []);
		},
		createBatch : function() {

			var name = this.controller.get('batchName'),
				month = this.controller.get('selectedMonth'),
				start = moment(this.controller.get('startDate')),
				end = moment(this.controller.get('endDate')),
				nrcRanges, recRent, newBatch, newRenewalComm, newRenewalUnit, newRenewalRange, ut, communityId;

			// Create the new renewal-batch object
			this.store.findRecord("user", this.controller.get("user._id")).then( (user) => {
				newBatch = this.store.createRecord('renewalBatch', {
					name : name,
					month : month,
					startDate : start,
					endDate : end,
					createdBy : user
				});

				// Save the new renewal-batch and then add renewal-comm objects
				newBatch.save().then( (nb) => {
					// Create the new renewal-range objects related to this batch
					newRenewalRange = this.store.createRecord("renewalRange", {
						batch : nb,
						type : "at",
						minIncrease : 0,
						isBatch : true
					});
					newRenewalRange.save();
					newRenewalRange = this.store.createRecord("renewalRange", {
						batch : nb,
						type : "below",
						minIncrease : 0,
						maxIncrease : 0,
						bringToMktRate : 0,
						from : 0,
						isBatch : true
					});
					newRenewalRange.save();
					newRenewalRange = this.store.createRecord("renewalRange", {
						batch : nb,
						type : "above",
						minIncrease : 0,
						from : 0,
						isBatch : true
					});
					newRenewalRange.save();

					// Loop through the selected communities
					this.controller.get("selectedCommunities").forEach(function(community) {

						// Create the new renewal-community object
						newRenewalComm = this.store.createRecord("renewalComm", {
							batch : nb,
							community : community
						});

						// Save the new renewal-comm and then add renewal-unit objects
						newRenewalComm.save().then( (nrc) => {
							nb.get("communities").addObject(nrc);

							// Create the new renewal-range objects related to this batch and renewal-comm
							this.store.query("renewalRange", { community : community.get("id"), isCommunity : true }).then( (ranges) => {
								nrcRanges = ranges;
								ranges.forEach(function(range) {
									newRenewalRange = this.store.createRecord("renewalRange", {
										batch : nb,
										community : community,
										renewalComm : nrc,
										type : range.get("type"),
										minIncrease : range.get("minIncrease"),
										maxIncrease : range.get("maxIncrease"),
										from : range.get("from"),
										to : range.get("to"),
										bringToMktRate : range.get("bringToMktRate"),
										isRenewalComm : true
									});
									newRenewalRange.save();
								}, this);

								// Get all the units for the community which are expiring within the selected date range
								this.store.query("unit", { community : community.get("id"), startDate : start.format("YYYY-MM-DD"), endDate : end.format("YYYY-MM-DD") }).then( (units) => {
									// Loop through the units
									units.forEach(function(unit) {

										// Create the new renewal-unit object
										newRenewalUnit = this.store.createRecord("renewalUnit", {
											renewalComm : nrc,
											unitNumber : unit.get("unitNumber"),
											unitType : unit.get("unitType"),
											pmsUnitType : unit.get("pmsUnitType"),
											beds : unit.get("beds"),
											baths : unit.get("baths"),
											renewalDate : unit.get("leaseExpirationDate"),
											resident : unit.get("leaseCurrentResident"),
											currentLeaseTerm : unit.get("leaseCurrentTerm"),
											currentRent : unit.get("leaseCurrentRent"),
											cmr : unit.get("cmr"),
											recLeaseTerm : 12
										});

										// Calculate the recRent
										// Are there a unit type renewal ranges?
										// If not, use the community renewal ranges
										nrc.get("units").addObject(newRenewalUnit);
										newRenewalUnit.save().then( (nru) => {
											ut = nru.get("unitType");
											communityId = nru.get("renewalComm.community.id");
											this.store.query("renewalRange", { community : communityId, unitType : ut, isUnitType : true, isRenewalComm : false }).then( (utRanges) => {
												if( utRanges.length ) {
													recRent = this.calcRenewalOffer(nru, utRanges);

												} else {
													recRent = this.calcRenewalOffer(nru, nrcRanges);
												}

												nru.set("recRent", recRent.offer);
												nru.set("finalRecRent", recRent.offer);
												nru.set("renewalRange", recRent.range);
												nru.save();
											});
										});
									}, this);
								});
							});

							this.store.query("renewalRange", { community : community.get("id"), isUnitType : true, isRenewalComm : false }).then( (newUtRanges) => {
								newUtRanges.forEach(function(utRange) {
									let newRange = this.store.createRecord("renewalRange", {
										batch : nb,
										community : community,
										renewalComm : nrc,
										unitType : utRange.get("unitType"),
										type : utRange.get("type"),
										minIncrease : utRange.get("minIncrease"),
										maxIncrease : utRange.get("maxIncrease"),
										from : utRange.get("from"),
										to : utRange.get("to"),
										bringToMktRate : utRange.get("bringToMktRate"),
										isRenewalComm : true,
										isUnitType : true
									});
									newRange.save();
								}, this);
							});
						});
					}, this);

					// Reset the input values
					this.controller.setProperties({
						'batchName' : null,
						'month' : null,
						"selectedCommunities" : [],
						'startDate' : null,
						'endDate' : null
					});

					// Transition back to the list of open batches
					this.transitionTo("lro.renewals.batches.home.open");
				});
			});
		}
	}
});
