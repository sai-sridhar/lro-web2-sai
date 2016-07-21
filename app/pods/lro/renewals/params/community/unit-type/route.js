import Ember from 'ember';

export default Ember.Route.extend({
	model(params, transition) {
		let community_id = transition.params["lro.renewals.params.community"].community_id;
		return this.store.query("renewalRange", { unitType : params.unit_type, community : community_id, isUnitType : true });
	}
});
