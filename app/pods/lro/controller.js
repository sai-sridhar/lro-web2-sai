import Ember from 'ember';

export default Ember.Controller.extend({
	session : Ember.inject.service('session'),

	user : Ember.computed("session", function() {
		// return {
		// 	_id : "57ab424ccb47d311006484a2",
		// 	email : "aalexander@letitrain.com",
		// 	firstName : "Anish",
		// 	lastName : "Alexander",
		// 	password : null
		// };
		return this.get("session.session.content.authenticated.user");
	}),
	userInitials : Ember.computed("user", function() {
		var user = this.get("user");
		return user.firstName.charAt(0) + user.lastName.charAt(0);
	}),

	showMenu : false,
	showUserMenu : false
});
