import Ember from 'ember';

export default Ember.Route.extend({
	redirect : function() {
    	this.transitionTo("lro.admin.communities.community.info");
  	}
});
