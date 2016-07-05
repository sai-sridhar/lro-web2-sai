import Ember from 'ember';
import computedFilterByQuery from 'ember-cli-filter-by-query';

export default Ember.Controller.extend({

	sortProperties : ["firstName:asc"],
	filteredContent : computedFilterByQuery("model.[]", ['firstName', 'lastName', 'email'], "searchText"),
	arrangedContent : Ember.computed.sort("filteredContent", "sortProperties")
});
