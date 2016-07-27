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
		},
		sort(prop) {
			// What is the current sortBy property
			var sort = this.controller.get("sortBy.firstObject").split(":"),
				currentProp = sort.get("firstObject"),
				direction = sort.get("lastObject");

			// If it is the same as what was clicked on, reverse the direction
			if( prop === currentProp ) {
				if( direction === "asc" ) {
					direction = "desc";
				} else {
					direction = "asc";
				}
			} else {
				direction = "asc";
			}
			this.controller.set("sortBy", [ prop+":"+direction]);
		}
	}
});
