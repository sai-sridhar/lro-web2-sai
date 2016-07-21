import Ember from 'ember';

export default Ember.Route.extend({
	model(params) {
		return this.store.query("renewalRange", { community : params.community_id, isCommunity : true});
	},
	setupController(controller, model) {
		this._super(controller, model);
		this.store.query("unitType", { community : model.get("firstObject.community.id") }).then( (unitTypes) => {
			controller.set("unitTypes", unitTypes);
		});
	},
	actions : {
		refreshModel : function() {
			this.refresh();
		}
	}
});
