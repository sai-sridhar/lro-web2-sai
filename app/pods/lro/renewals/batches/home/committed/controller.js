import Ember from 'ember';
import computedFilterByQuery from 'ember-cli-filter-by-query';

export default Ember.Controller.extend({

	batchesController : Ember.inject.controller("lro.renewals.batches"),
	searchText : Ember.computed.reads("batchesController.searchText"),

	filteredContent : computedFilterByQuery("model.[]", ['name', 'dateRange', 'modifiedBy'], "searchText")

});
