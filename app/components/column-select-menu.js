import Ember from 'ember';

export default Ember.Component.extend({

	showMenu : false,

	actions : {
		toggleMenu : function() {
			this.toggleProperty("showMenu");
		}
	}
});
