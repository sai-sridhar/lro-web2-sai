import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	actions : {
		toggleMainMenu : function() {
			this.controller.toggleProperty("showMenu");
		},
		toggleUserMenu : function() {
			this.controller.toggleProperty("showUserMenu");
		},
		logout : function() {
			this.controller.get("session").invalidate();
		}
	}
});
