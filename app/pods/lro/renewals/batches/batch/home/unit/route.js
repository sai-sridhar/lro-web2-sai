import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params) {
		return this.store.findRecord("renewalUnit", params.unit_id);
	},
	actions : {
		close : function() {
			this.transitionTo("lro.renewals.batches.batch.home");
		}
	}
});
