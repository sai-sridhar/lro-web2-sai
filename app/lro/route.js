import Ember from 'ember';

export default Ember.Route.extend({
	actions : {
		toggleMainMenu : function() {
			this.controller.toggleProperty("showMenu");
		}
	}
});
