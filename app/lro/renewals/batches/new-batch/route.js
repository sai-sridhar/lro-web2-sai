import Ember from 'ember';

export default Ember.Route.extend({
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

			// create a new renewal-batch object
			var name = this.controller.get('batchName'),
				month = this.controller.get('selectedMonth'),
				start = moment(this.controller.get('startDate')),
				end = moment(this.controller.get('endDate')),
				newBatch,
				newRenewalComm,
				newRenewalUnit;

			newBatch = this.store.createRecord('renewalBatch', {
				name : name,
				month : month,
				startDate : start,
				endDate : end
			});

			newBatch.save().then( (nb) => {
				this.controller.get("selectedCommunities").forEach(function(community) {

					newRenewalComm = this.store.createRecord("renewalComm", {
						batch : nb,
						community : community
					});

					newRenewalComm.save().then( (nrc) => {
						nb.get("communities").addObject(nrc);

						this.store.query("unit", { community : community.get("id"), startDate : start.format("YYYY-MM-DD"), endDate : end.format("YYYY-MM-DD") }).then( (units) => {
							units.forEach(function(unit) {
								// console.log("in the units loop");
								// Create the new Renewal Unit object
								newRenewalUnit = this.store.createRecord("renewalUnit", {
									// community : community,
									renewalComm : nrc,
									// batch : nb,
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
									recLeaseTerm : 12,
									recRent : unit.get("leaseCurrentRent") * 1.04,
									finalRecRent : unit.get("leaseCurrentRent") * 1.04
								});

								// Relate the new Renewal Unit to the new Renewal Batch and Renewal Comm
								// nb.get("units").addObject(newRenewalUnit);
								nrc.get("units").addObject(newRenewalUnit);
								newRenewalUnit.save();
							}, this);
						});
					});
				}, this);

				this.controller.set('batchName', null);
				this.controller.set('month', null);
				this.controller.set("selectedCommunities", []);
				this.controller.set('startDate', null);
				this.controller.set('endDate', null);

				this.transitionTo("lro.renewals.batches.open");
			});
		}
	}
});
