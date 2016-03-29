import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params) {
		return this.store.findRecord("renewalUnit", params.unit_id);
	},
	afterModel : function(params) {
		// this.store.query('renewalTerm', { renewalUnit : params.unit_id });
	},
	setupController : function(controller, model) {
		this._super(controller, model);
		if( !model.get("finalRecRent") ) {
			model.set("finalRecRent", model.get("recRent"));
		}
	},
	actions : {
		close : function() {
			this.transitionTo("lro.renewals.batch.community");
		}
	}
});
