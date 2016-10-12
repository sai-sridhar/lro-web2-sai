import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.findAll("community");
	},
	setupController(controller, model) {
		this._super(controller, model);
		controller.set("selectedCommunities", null);
	},
	actions : {
		apply : function() {
			let model = this.controllerFor("lro.admin.users.groups.group").get("model"),
				comms = model.get("communities");
			this.controller.get("selectedCommunities").forEach(function(comm) {
				comms.addObject(comm);
			});
			model.save().then( () => {
				this.send("cancel");
			});
		},
		cancel : function() {
			this.controller.set("selectedCommunities", null);
			this.transitionTo("lro.admin.users.groups.group.properties");
		}
	}
});
