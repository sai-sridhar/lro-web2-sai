import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params, transition) {
		var community_id = transition.params["lro.pricingLeasing.community"].community_id;
		return this.store.query("renewalUnit", { community : community_id, approved : true });
	},
	actions : {
		toggleFilters : function() {
			this.controller.toggleProperty("showFilters");
		},
		toggleDownloads : function() {
			this.controller.toggleProperty("showDownloadMenu");
		}
	}
});
