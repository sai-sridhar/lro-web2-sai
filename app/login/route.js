import Ember from 'ember';

export default Ember.Route.extend({
	actions : {
		authenticate : function() {
			var identification = this.controller.get('identification'),
				password = this.controller.get('password');

			this.controller.get('session').authenticate('authenticator:oauth2', identification, password).then( () => {
				// this.controller.set('loginError', reason.error);
				// this.transitionTo('products');
			}, function(reason) {
				this.controller.set('loginError', reason.error);
			});
		}
	}
});
