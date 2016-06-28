import Ember from 'ember';
import RenewalMixin from 'zion/mixins/renewal';

export default Ember.Route.extend( RenewalMixin, {

	model : function(params, transition) {
		var batch_id = transition.params["lro.renewals.batches.batch"].batch_id;
		return this.store.query("renewalRange", { batch : batch_id, isBatch : true });
	},
	actions : {
		refreshModel : function() {
			this.refresh();
		},
		apply : function() {
			var renewalUnits, recRent;
			// Loop through the selected communities
			this.controller.get("selectedCommunities").forEach(function(comm) {
				// Get all the renewal units for the community, filtering for unapproved
				renewalUnits = comm.get("units").filterBy("approved", false);

				// Apply the logic to calculate the new recRent, save
				renewalUnits.forEach(function(rUnit) {
					recRent = this.calcRenewalOffer(rUnit, this.controller.get("model"));
					rUnit.set("recRent", recRent);
					rUnit.set("finalRecRent", recRent);
					rUnit.save();
				}, this);
			}, this);

			// After all the re-calc, set the selected communities to [] and transition back to home
			this.controller.set("selectedCommunities", null);
			this.transitionTo("lro.renewals.batches.batch.home");
		},
		cancel : function() {
			this.transitionTo("lro.renewals.batches.batch.home");
		},

	}
});
