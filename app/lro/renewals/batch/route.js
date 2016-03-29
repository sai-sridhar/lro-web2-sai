import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params) {
		return this.store.findRecord("renewalBatch", params.batch_id);
	},
	afterModel : function(params) {
		this.store.query('renewalComm', { batch : params.batch_id });
		this.store.query('renewalUnit', { batch : params.batch_id });
	},
});
