import Ember from 'ember';
import RenewalMixin from 'zion/mixins/renewal';

export default Ember.Route.extend(RenewalMixin, {

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

				// Loop through the selected beds
				this.controller.get("selectedBeds").forEach(function(bed) {
					// Get all the renewal units for the community, filtering for unapproved and bed
					renewalUnits = comm.get("units").filterBy("approved", false).filterBy("userOverrideMode", null).filterBy("beds", bed.text);

					// Apply the logic to calculate the new recRent, save
					renewalUnits.forEach(function(rUnit) {
						recRent = this.calcRenewalOffer(rUnit, this.controller.get("model"));
						rUnit.set("recRent", recRent.offer);
						rUnit.set("finalRecRent", recRent.offer);
						rUnit.set("renewalRange", recRent.range);
						rUnit.save();
					}, this);
				}, this);
			}, this);

			// After all the re-calc, set the selected communities to [] and transition back to home
			this.controller.setProperties({
				"selectedCommunities" : null,
				"selectedBeds" : null
			});
			this.transitionTo("lro.renewals.batches.batch.home");
		},
		cancel : function() {
			this.controller.setProperties({
				"selectedCommunities" : null,
				"selectedBeds" : null
			});
			this.transitionTo("lro.renewals.batches.batch.home");
		},

	}
});
