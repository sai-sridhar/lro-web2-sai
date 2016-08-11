import Ember from 'ember';

export default Ember.Controller.extend({
	credentialsEntered : Ember.computed("emailAddress", "password", function() {
      	if( this.get("emailAddress") && this.get("password") ) {
      		return true;
      	} else {
      		return false;
      	}
    }),
	attemptingLogin : false,
    emailAddress : null,
    password : null,
});
