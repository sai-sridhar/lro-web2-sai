import Ember from 'ember';
import computedFilterByQuery from 'ember-cli-filter-by-query';

export default Ember.Component.extend({
	tagName : "section",
	classNames : ["catalog"],
	filteredContent : computedFilterByQuery('model', ['fullName','email', 'roleName', 'groupName'], 'searchText'),

});
