import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params) {
		console.log(params.user_id);
		console.log(params);
		return this.store.findRecord("user", params.user_id);		
	},
	actions : {
		delete : function() {
			this.controllerFor("lro.admin.users.people").get("model").removeObject(this.controller.get("model"));
			this.transitionTo("lro.admin.users.people");
		}
	}
});
