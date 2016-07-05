import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params) {
		return this.store.findRecord("user", params.user_id);
	},
	actions : {
		saveUser : function() {
			this.transitionTo("lro.admin.users");
		},
		cancel : function() {
			this.transitionTo("lro.admin.users");
		}
	}
});
