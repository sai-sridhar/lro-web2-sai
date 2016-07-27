import Ember from 'ember';
import computedFilterByQuery from 'ember-cli-filter-by-query';

export default Ember.Controller.extend({
	query : null,
	filteredList : computedFilterByQuery('model', ['name','code'], 'query'),
	hbsContent : Ember.computed.sort("filteredList", "sortBy"),
	sortBy : ["name:asc"]
});
