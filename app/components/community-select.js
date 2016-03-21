import Ember from 'ember';

export default Ember.Component.extend({

	showCommunityMenu : false,

	actions : {
		toggleCommunityMenu : function() {
			this.toggleProperty("showCommunityMenu");
		}
  	}
});
