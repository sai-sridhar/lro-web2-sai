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
			this.controller.get("model").setEach("selected", true);
		},
		deselectAll : function() {
			this.controller.get("model").setEach("selected", false);
		},
		createBatch : function() {
			var self = this;

			// create a new renewal-batch object
			var name = this.controller.get('batchName'),
				month = this.controller.get('selectedMonth'),
				newBatch,
				newRenewalComm,
				newRenewalUnit;

			newBatch = this.store.createRecord('renewalBatch', {
				name : name,
				month : month
			});

			newBatch.save().then( () => {
				this.controller.get("model").forEach(function(community) {
					if( community.selected ) {

						newRenewalComm = this.store.createRecord("renewalComm", {
							community : community,
							batch : newBatch
						});

						newBatch.get("communities").addObject(newRenewalComm);

						// create the renewal-unit records
						// assume all the units fit the renewal range for the moment
						this.store.query("unit", { community : community.get("id") }).then( (units) => {
							units.forEach(function(unit) {
								console.log("in the units loop");
								// Create the new Renewal Unit object
								newRenewalUnit = this.store.createRecord("renewalUnit", {
									renewalComm : newRenewalComm,
									batch : newBatch,
									unitId : unit.get("unitNumber"),
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
								newBatch.get("units").addObject(newRenewalUnit);
								newRenewalComm.get("units").addObject(newRenewalUnit);

							}, this);

							newRenewalComm.save().then( () => {
								var promises = Ember.A();

								newRenewalComm.get("units").forEach(function(renewalUnit) {
									promises.push(renewalUnit.save());
								});

								Ember.RSVP.Promise.all(promises).then( (resolvedPromises) => {
									console.log("hiyo!");
								})
							});
						});
					}
				}, this);

				this.transitionTo("lro.renewals.batches.open");
			});
		}
	}
});
