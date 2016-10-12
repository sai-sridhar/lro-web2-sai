import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.findAll("grp");
	},
	setupController(controller, model) {
		this._super(controller, model);
		controller.setProperties({
			"selectedGroups" : null,
			"groupRole" : null,
			"selectedProps" : null,
			"propRole" : null
		});
		this.store.findAll("role").then( (roles) => {
			controller.set("roles", roles);
		});
		this.store.findAll("community").then( (comms) => {
			controller.set("properties", comms);
		});
	},
	actions : {
		apply : function() {
			let groupRole = this.controller.get("groupRole"),
				propRole = this.controller.get("propRole"),
				user = this.controllerFor("lro.admin.users.people.user").get("model"),
				groups = this.controller.get("selectedGroups"),
				props = this.controller.get("selectedProps");

			// Iterate each selected group
			if( groups ) {
				groups.forEach(function(group) {
					// Create the member record for the user/group/role
					let newGroupMember = this.store.createRecord("member", {
						user : user,
						grp : group,
						role : groupRole,
						type : "group"
					});

					newGroupMember.save().then( () => {
						// Add the member record to the user
						user.get("groups").pushObject(newGroupMember);
						// Add the member record to the group
						group.get("members").pushObject(newGroupMember);
					});
				}, this);
			}

			// Iterate each selected prop
			if( props ) {
				props.forEach(function(prop) {
					// Create the member record for the user/prop/role
					let newPropMember = this.store.createRecord("member", {
						user : user,
						prop : prop,
						role : propRole,
						type : "prop"
					});

					newPropMember.save().then( () => {
						// Add the member record to the user
						user.get("groups").pushObject(newPropMember);
					});
				}, this);
			}

			this.transitionTo("lro.admin.users.people.user");
		},
		cancel : function() {
			this.controller.setProperties({
				"selectedGroups" : null,
				"groupRole" : null,
				"selectedProps" : null,
				"propRole" : null
			});
			this.transitionTo("lro.admin.users.people.user");
		},
	}
});
