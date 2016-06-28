import Ember from 'ember';
import RenewalMixin from 'zion/mixins/renewal';

export default Ember.Route.extend( RenewalMixin, {
	model : function() {
		return this.store.findAll("community");
	},

	actions : {
		selectCommunity : function(community) {
			community.toggleProperty("selected");
		},
		selectAll : function() {
			// this.controller.get("model").setEach("selected", true);
			this.controller.set("selectedCommunities", []);
			this.controller.get("model").forEach(function(comm) {
				this.controller.get("selectedCommunities").pushObject(comm);
			}, this);
			// this.controller.set("selectedCommunities", this.controller.get("model"));
		},
		deselectAll : function() {
			// this.controller.get("model").setEach("selected", false);
			this.controller.set("selectedCommunities", []);
		},
		createBatch : function() {
			var name = this.controller.get('batchName'),
				month = this.controller.get('selectedMonth'),
				start = moment(this.controller.get('startDate')),
				end = moment(this.controller.get('endDate')),
				dtm, recRent, newBatch, newRenewalComm, newRenewalUnit, newRenewalRange, nrcRanges;

			// Create the new renewal-batch object
			newBatch = this.store.createRecord('renewalBatch', {
				name : name,
				month : month,
				startDate : start,
				endDate : end
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
						});

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
								// Are there a unit type renewal ranges?  Assume no for the moment.
								// If not, use the community renewal ranges
								recRent = this.calcRenewalOffer(newRenewalUnit, nrcRanges);
								newRenewalUnit.set("recRent", recRent);
								newRenewalUnit.set("finalRecRent", recRent);

								// Relate the new Renewal Unit to the new Renewal Batch and Renewal Comm
								nrc.get("units").addObject(newRenewalUnit);
								newRenewalUnit.save();
							}, this);
						});
					});
				}, this);

				// Reset the input values
				this.controller.set('batchName', null);
				this.controller.set('month', null);
				this.controller.set("selectedCommunities", []);
				this.controller.set('startDate', null);
				this.controller.set('endDate', null);

				// Transition back to the list of open batches
				this.transitionTo("lro.renewals.batches.home.open");
			});
		}
	}
});
