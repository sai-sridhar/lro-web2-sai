import Ember from 'ember';
import computedFilterByQuery from 'ember-cli-filter-by-query';

export default Ember.Controller.extend({
	sortProperties : ["name:asc"],
	filteredContent : computedFilterByQuery("model.[]", ['name', 'code'], "searchText"),
	arrangedContent : Ember.computed.sort("filteredContent", "sortProperties")
});
