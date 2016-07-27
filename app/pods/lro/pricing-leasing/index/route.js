import Ember from 'ember';

export default Ember.Route.extend({
	actions : {
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
