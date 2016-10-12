import Ember from 'ember';

export default Ember.Route.extend({
	model : function() {
		return this.store.createRecord("role", {});
	},
	actions : {
		save : function() {
			this.controller.get("model").save().then( (role) => {
				this.transitionTo("lro.admin.users.roles.role", role.get("id"));
			});
		},
		cancel : function() {
			this.controller.get("model").deleteRecord();
			this.transitionTo("lro.admin.users.roles");
		}
	}
});
