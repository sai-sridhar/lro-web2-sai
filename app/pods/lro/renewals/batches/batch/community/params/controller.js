import Ember from 'ember';

export default Ember.Controller.extend({
	renewalCommController : Ember.inject.controller("lro.renewals.batches.batch.community"),
	unitTypes : Ember.computed.reads("renewalCommController.unitTypeContent"),
	renewalUnits : Ember.computed.reads("renewalCommController.model.units")
});
