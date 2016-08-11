import Ember from 'ember';

export default Ember.Route.extend({
	actions : {
		authenticate : function() {
			let loginIndex = this.controllerFor("login.index");

			// Set the property that will trigger the loading indicator
			loginIndex.set("attemptingLogin", true);

			// Grab the credentials the user entered
			var identification = loginIndex.get('emailAddress'),
				password = loginIndex.get('password');

			// Attempt the login
			this.controller.get('session').authenticate('authenticator:oauth2', identification, password).then( () => {
				// Take the user to LRO!
				loginIndex.set("attemptingLogin", false);

				this.transitionTo('lro');
			}, function(response) {
				loginIndex.set("attemptingLogin", false);
				// Reset email and password fields
				loginIndex.set('emailAddress', null);
				loginIndex.set('password', null);
				// Set the message the user will see
				if( response.error === "invalid_grant" ) {
					loginIndex.set('loginError', "invalid username or password");
				} else {
					loginIndex.set('loginError', "invalid username or password");
				}
			});
		},
		expandBanner : function() {
			this.controller.set("bannerExpanded", true);
		},
		collapseBanner : function() {
			this.controller.set("bannerExpanded", false);
		}
	}
});
