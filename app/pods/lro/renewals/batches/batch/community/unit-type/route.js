// Jason Testing Unit Type Params

import Ember from 'ember';
import RenewalMixin from 'zion/mixins/renewal';

export default Ember.Route.extend(RenewalMixin, {
	model(params, transition) {
		let batch_id = transition.params["lro.renewals.batches.batch"].batch_id,
			renewal_comm_id = transition.params["lro.renewals.batches.batch.community"].community_id;
		return this.store.query("renewalRange", { unitType : params.unit_type, batch : batch_id, renewalComm : renewal_comm_id, isUnitType : true, isRenewalComm : true });
	},

	setupController(controller, model) {
		this._super(controller, model);

		// Get the community id
		let c = this.controllerFor("lro.renewals.batches.batch.community"),
			community_id = c.get("model.community.id"),
			unit_type = model.get("query.unitType");

		// Query for the default renewal parameter for the unit type and set property on controller
		this.store.query("renewalRange", { unitType : unit_type, community : community_id, isUnitType : true, isRenewalComm : false }).then( ranges => {
			controller.set("defaultRanges", ranges);
		});
	},

	actions : {
		close : function() {
			this.transitionTo("lro.renewals.batches.batch.community");
		},
		applyParameters : function() {
			let renewalComm = this.controllerFor("lro.renewals.batches.batch.community"),
				renewalUnits = renewalComm.get("model.units").filterBy("unitType", this.controller.get("model.firstObject.unitType")).filterBy("approved", false).filterBy("userOverrideMode", null),
				recRent;

			// Apply the logic to calculate the new recRent, save
			renewalUnits.forEach(function(rUnit) {
				recRent = this.calcRenewalOffer(rUnit, this.controller.get("model"));
				rUnit.set("recRent", recRent.offer);
				rUnit.set("finalRecRent", recRent.offer);
				rUnit.set("renewalRange", recRent.range);
				rUnit.save();
			}, this);

			this.transitionTo("lro.renewals.batches.batch.community");
		}
	}
});
