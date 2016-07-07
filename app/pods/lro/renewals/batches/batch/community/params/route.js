import Ember from 'ember';
import RenewalMixin from 'zion/mixins/renewal';

export default Ember.Route.extend( RenewalMixin, {

	model : function(params, transition) {
		var batch_id = transition.params["lro.renewals.batches.batch"].batch_id,
			community_id = transition.params["lro.renewals.batches.batch.community"].community_id;
		return this.store.query("renewalRange", { batch : batch_id, isRenewalComm : true, renewalComm : community_id });
	},
	actions : {
		refreshModel : function() {
			this.refresh();
		},
		apply : function() {
			var renewalUnits, recRent;
			// Loop through the selected unit types
			this.controller.get("selectedUnitTypes").forEach(function(ut) {
				// Get all the renewal units for the unit type, filtering for unapproved
				renewalUnits = this.controller.get("renewalUnits").filterBy("unitType", ut.get("unitType")).filterBy("approved", false);

				// Apply the logic to calculate the new recRent, save
				renewalUnits.forEach(function(rUnit) {
					recRent = this.calcRenewalOffer(rUnit, this.controller.get("model"));
					rUnit.set("recRent", recRent);
					rUnit.set("finalRecRent", recRent);
					rUnit.save();
				}, this);
			}, this);

			// After all the re-calc, set the selected communities to [] and transition back to home
			this.controller.set("selectedUnitTypes", null);
			this.transitionTo("lro.renewals.batches.batch.community");
		},
		cancel : function() {
			this.transitionTo("lro.renewals.batches.batch.community");
		},

	}
});
