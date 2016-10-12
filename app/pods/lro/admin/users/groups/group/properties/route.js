import Ember from 'ember';

export default Ember.Route.extend({
	actions : {
		delete(prop) {
			let model = this.controllerFor("lro.admin.users.groups.group").get("model");
			model.get("communities").removeObject(prop);
			model.save();
		}
	}
});
