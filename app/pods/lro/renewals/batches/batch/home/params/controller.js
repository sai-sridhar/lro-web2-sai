import Ember from 'ember';

export default Ember.Controller.extend({
	batchController : Ember.inject.controller("lro.renewals.batches.batch.home"),
	communities : Ember.computed.reads("batchController.model.communities"),
	beds : Ember.computed.reads("batchController.model.beds"),

	canApplyParameters : Ember.computed("selectedCommunities", "selectedBeds", function() {
		// first, perform validation
		// 1. Must select at least one community
		// 2. Must select at least one bed count
		if( this.get("selectedCommunities.length") > 0 && this.get("selectedBeds.length") > 0 ) {
			return true;
		}
		return false;
	}),
});
