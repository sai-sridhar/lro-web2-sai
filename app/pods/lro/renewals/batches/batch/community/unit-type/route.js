import Ember from 'ember';

export default Ember.Route.extend({

	setupController(controller, model) {
		this._super(controller, model);

		// Get the community id
		let c = this.controllerFor("lro.renewals.batches.batch.community"),
			community_id = c.get("model.community.id");

		// Get the unit type


		// Query for the default renewal parameter for the unit type and set property on controller
		this.store.query("renewalRange", { unitType : model.unit_type, community : community_id, isUnitType : true }).then( ranges => {
			controller.set("defaultRanges", ranges);
		});
	},

	actions : {
		close : function() {
			this.transitionTo("lro.renewals.batches.batch.community");
		}
	}
});
