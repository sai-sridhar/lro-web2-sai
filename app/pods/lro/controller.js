import Ember from 'ember';

export default Ember.Controller.extend({
	session : Ember.inject.service('session'),
	userInitials : Ember.computed("session", function() {
		var user = this.get("session.session.content.authenticated.user");
		return user.firstName.charAt(0) + user.lastName.charAt(0);
	}),
	showMenu : false,
	showUserMenu : false
});
