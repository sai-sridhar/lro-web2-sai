import Ember from 'ember';

export default Ember.Controller.extend({
	batchController : Ember.inject.controller("lro.renewals.batches.batch.home"),
	communities : Ember.computed.reads("batchController.model.communities"),
});
