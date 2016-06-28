import Ember from 'ember';

export default Ember.Route.extend({

	actions : {
		toggleSectionMenu : function() {
			this.controller.toggleProperty("showMenu");
		}
	}
});
