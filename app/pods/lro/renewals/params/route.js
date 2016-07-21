import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.findAll("community");
	},
	actions : {
		sort : function(prop) {
			// What is the current unitSortBy property
			var sort = this.controller.get("sortProperties.firstObject").split(":"),
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
			this.controller.set("sortProperties", [ prop+":"+direction]);
		},
	}
});
