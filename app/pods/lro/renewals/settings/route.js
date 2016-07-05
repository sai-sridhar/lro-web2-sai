import Ember from 'ember';

export default Ember.Route.extend({
	model : function() {
		return this.store.findRecord("renewalSetting", "577275c249a8dc6c53e68862");
	},
	actions : {
		saveSettings : function() {
			let settings = this.controller.get("model");
			settings.save().then(() => {
				console.log("save successful");
			});
		}
	}
});
