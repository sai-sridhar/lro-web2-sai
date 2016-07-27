import Ember from 'ember';
import computedFilterByQuery from 'ember-cli-filter-by-query';

export default Ember.Controller.extend({
	searchText : null,
	filteredContent : computedFilterByQuery('model', ['name','code'], 'searchText'),
	sortBy : ["name:asc"],
	hbsContent : Ember.computed.sort("filteredContent", "sortBy")

});
