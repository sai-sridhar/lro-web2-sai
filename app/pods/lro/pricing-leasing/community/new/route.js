import Ember from 'ember';

export default Ember.Route.extend({

	model : function(params, transition) {
		var community_id = transition.params["lro.pricingLeasing.community"].community_id;
		return this.store.query("newPricing", { community : community_id });
	},

	setupController : function(controller, model) {
		this._super(controller, model);

		controller.set("userPrice", controller.get("maxPrice"));
	},

	actions : {
		toggleFilters : function() {
			this.controller.toggleProperty("showFilters");
		},
		filterUnitTypes : function(ut) {
			ut.toggleProperty("active");

			var t = ut.get("unitType");
			var i = this.controller.get("filteredUnitTypes").indexOf(t);

			if( i >= 0 ) {
				this.controller.get("filteredUnitTypes").removeObject(t);
			} else {
				this.controller.get("filteredUnitTypes").pushObject(t);
			}
		},
		clearUtFilter : function() {
			this.controller.get("summarizedContent").forEach(function(itm) {
				itm.set("active", false);
			});
			this.controller.get("filteredUnitTypes").clear();

		}
	}
});
