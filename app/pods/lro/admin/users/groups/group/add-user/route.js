import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.findAll("user");
	},
	setupController(controller, model) {
		this._super(controller, model);
		this.store.findAll("role").then( (roles) => {
			controller.set("roles", roles);
		})
		controller.set("selectedUsers", null);
		controller.set("selectedRole", null);
	},
	actions : {
		apply : function() {
			let id = this.controllerFor("lro.admin.users.groups.group").get("model.id"),
				grp = this.store.peekRecord("grp", id),
				members = grp.get("members"),
				role = this.controller.get("selectedRole");

			this.controller.get("selectedUsers").forEach(function(user) {
				// Create New Group User
				let newGroupMember = this.store.createRecord("member", {
					user : user,
					grp : grp,
					role : role,
					type : "group"
				});

				// Save New Group User
				newGroupMember.save().then( () => {
					grp.get('members').pushObject(newGroupMember);
				});
			}, this);

			let self = this;
			Ember.run.later((function() {
				self.transitionTo("lro.admin.users.groups.group.users");
			}), 1000);
		},
		cancel : function() {
			this.controller.set("selectedUsers", null);
			this.controller.set("selectedRole", null);
			this.transitionTo("lro.admin.users.groups.group.users");
		}
	}
});
