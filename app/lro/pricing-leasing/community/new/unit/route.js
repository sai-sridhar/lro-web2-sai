import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params) {
		return this.store.findRecord("newPricing", params.unit_id);
	},
	afterModel : function(params) {
		this.store.query('leaseTerm', { newPricing : params.unit_id });
	}
});
