import Ember from 'ember';

export default Ember.Route.extend({
	model : function() {
		return this.store.findAll('community');
	},

	actions : {
		addCommunity : function() {
			console.log("trying to add a new community...");
			var name = this.controller.get("newCommunityName"),
				code = this.controller.get("newCommunityCode");

			var community = this.store.createRecord('community', {
				name : name,
				code : code
			});

			community.save().then( () => {
				console.log('save successful');
				this.controller.set('newCommunityName', null);
				this.controller.set('newCommunityCode', null);
				this.refresh();
			}, function() {
				console.log('save failed');
			});
		},
		initAddCommunity : function() {
			this.controller.set("addingCommunity", true);
		},
		cancelAddCommunity : function() {
			this.controller.set("addingCommunity", false);
			this.controller.set("newCommunityName", null);
			this.controller.set("newCommunityCode", null);
		}
	}
});
