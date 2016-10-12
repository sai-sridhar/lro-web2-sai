import Ember from 'ember';

export default Ember.Route.extend({
	model(params, transition) {
		let group_id = transition.params["lro.admin.users.groups.group"].group_id;
		return this.store.query("member", { grp : group_id, type : "group" });
	},
	actions : {
		delete(member) {
			let model = this.controllerFor("lro.admin.users.groups.group").get("model");

			model.get("members").removeObject(member);
			member.deleteRecord();
			member.save();
		}
	}
});
