import Ember from 'ember';

export default Ember.Controller.extend({
	passwordComplete : function() {
      	if( this.get("password1").length > 0 && this.get("password2") === this.get("password1") ) {
      		return true;
      	} else {
      		return false;
      	}
    }.property("password1", "password2"),

    password1 : "",
    password2 : "",
});
