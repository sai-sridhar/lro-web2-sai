import Ember from 'ember';

export default Ember.Controller.extend({
	credentialsEntered : function() {
      	if( this.get("emailAddress").length > 0 && this.get("password").length > 0 ) {
      		return true;
      	} else {
      		return false;
      	}
    }.property("emailAddress", "password"),

    emailAddress : "",
    password : "",
});
