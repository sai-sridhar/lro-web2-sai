import Ember from 'ember';

export default Ember.Route.extend({

	model : function() {
		let user = this.controllerFor('lro').get('user'),
			email = user.email,
			user_id = user._id;

		if( email === "jtrkovsky@letitrain.com") {
			return this.store.query("renewalBatch", { status : "Open" });
		} else {
			return this.store.query("renewalBatch", { status : "Open", createdBy : user_id });
		}
	}
});
