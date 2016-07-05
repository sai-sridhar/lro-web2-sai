import Ember from 'ember';

export default Ember.Route.extend({
	model : function() {
		return this.store.createRecord("user", {});
	},
	actions : {
		saveUser : function() {
			var id = this.controller.get("model.id");
			this.transitionTo("lro.admin.users.user", id);
		},
		cancel : function() {
			this.controller.get("model").deleteRecord();
			this.transitionTo("lro.admin.users");
		}
	}
});
