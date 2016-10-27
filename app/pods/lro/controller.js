import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({
	session : Ember.inject.service('session'),

	user : Ember.computed("session", function() {
		return {
		 	_id : "57ab424ccb47d311006484a2",
		 	email : "aalexander@letitrain.com",
		 	firstName : "Anish",
		 	lastName : "Alexander",
		 	password : null
		};
		//return this.get("session.session.content.authenticated.user");
	}),
	//model : function() {
	//	return this.store.query("user", { firstName : "Sai" });
	//},
	userInitials : Ember.computed("user", function() {
		var user = this.get("user");
		return 'S' + 'S';
	}),

	showMenu : false,
	showUserMenu : false
});
