import Ember from 'ember';

export default Ember.Route.extend({
	actions : {
		authenticate : function() {
			var identification = this.controllerFor("login.index").get('emailAddress'),
				password = this.controllerFor("login.index").get('password'),
				self = this;

			this.controller.get('session').authenticate('authenticator:oauth2', identification, password).then( () => {
				// Take the user to LRO!
				this.transitionTo('lro');
			}, function(response) {
				// Reset email and password fields
				self.controllerFor("login.index").set('emailAddress', null);
				self.controllerFor("login.index").set('password', null);
				// Set the message the user will see
				if( response.error === "invalid_grant" ) {
					self.controllerFor('login.index').set('loginError', "invalid username or password");
				} else {
					self.controllerFor('login.index').set('loginError', "invalid username or password");
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
