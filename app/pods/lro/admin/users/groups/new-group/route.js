import Ember from 'ember';

export default Ember.Route.extend({
	model : function() {
		return this.store.createRecord("grp", {});
	},
	actions : {
		save : function() {
			this.controller.get("model").save().then( (grp) => {
				this.transitionTo("lro.admin.users.groups.group", grp.get("id"));
			});
		},
		cancel : function() {
			this.controller.get("model").deleteRecord();
			this.transitionTo("lro.admin.users.groups");
		}
	}
});
