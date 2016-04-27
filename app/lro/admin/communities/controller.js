import Ember from 'ember';
import computedFilterByQuery from 'ember-cli-filter-by-query';

export default Ember.Controller.extend({
	searchText : null,
	filteredModel : computedFilterByQuery('model', ['name','code'], 'searchText')

});
