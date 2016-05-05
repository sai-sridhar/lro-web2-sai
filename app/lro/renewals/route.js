import Ember from 'ember';

export default Ember.Route.extend({
	model : function() {
		 return this.store.findAll("community");
	},

	actions : {
		toggleSectionMenu : function() {
			this.controller.toggleProperty("showMenu");
		}
	}
});
