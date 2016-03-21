import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params, transition) {
		// console.log(transition.params["lro.admin.communities.community"].community_id);
		var community_id = transition.params["lro.admin.communities.community"].community_id;
		return this.store.findRecord('community', community_id);
	},

	actions : {
		saveCommunityInfo : function() {
			// set the isSaving property
			this.controller.set("isSaving", true);

			this.controller.get("model").save().then( () => {
				console.log('save successful');
				this.refresh();
				this.controller.set("isSaving", false);
			}, function() {
				console.log('save failed');
				this.controller.set("isSaving", false);
			});
		}
	}
});
