import Ember from 'ember';

export default Ember.Route.extend({
	model : function() {
		return this.store.createRecord("user", {});
	},
	actions : {
		saveUser : function() {
			let id = this.controller.get("model.id");
			// this.controllerFor("lro.admin.users.people").get("model").pushObject(this.controller.get("model"));
			this.transitionTo("lro.admin.users.people.user", id);
		},
		cancel : function() {
			this.controller.get("model").deleteRecord();
			this.transitionTo("lro.admin.users.people");
		}
	}
});
