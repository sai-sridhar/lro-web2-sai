import Ember from 'ember';

export default Ember.Route.extend({
	session : Ember.inject.service('session'),

	model : function() {
		let user = this.get("session.session.content.authenticated.user"),
			email = user.email,
			user_id = user._id;
		if( email === "jtrkovsky@letitrain.com") {
			return this.store.query("renewalBatch", { status : "Committed" });
		} else {
			return this.store.query("renewalBatch", { status : "Committed", createdBy : user_id });
		}
	}
});
