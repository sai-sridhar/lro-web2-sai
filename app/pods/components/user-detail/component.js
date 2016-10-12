import Ember from 'ember';

export default Ember.Component.extend({
	tagName : "section",
	classNames : ["user"],
	isNewUser : false,

	groupMembership : Ember.computed("model.groups.@each.type", function() {
		return this.get("model.groups").filterBy("type", "group");
	}),

	propertyMembership : Ember.computed("model.groups.@each.type", function() {
		return this.get("model.groups").filterBy("type", "prop");
	}),

	actions : {
		initEdit : function() {
			this.toggleProperty("isEditing");
		},
		save : function() {

			this.get("model").save().then(() => {
				if( this.get("isNewUser") ) {
					this.sendAction("save");
				} else {
					this.set("isEditing", false);
				}
			});
		},
		cancel : function() {
			if( this.get("isNewUser") ) {
				this.sendAction("cancel");
			} else {
				this.set("isEditing", false);
			}
		},
		delete : function() {

			let self = this,
				model = this.get("model");
			// launch sweet alert
			swal(
				{  	title: "Are you sure?",
					text: "",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, delete user",
					cancelButtonText: "No, cancel",
					closeOnConfirm: true,
					closeOnCancel: true
				},
				// if confirmed, set the isDeleted flag to true on the user model
				function (isConfirm) {
					if (isConfirm) {
						model.set("isDeleted", true);
						// then save
						model.save().then( (user) => {
							// then send the deleteUser action back to the parent route
							self.sendAction("deleteUser");
						});
					}
				}
			);
		}
	}
});
