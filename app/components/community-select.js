import Ember from 'ember';
import computedFilterByQuery from 'ember-cli-filter-by-query';

export default Ember.Component.extend({

	showCommunityMenu : false,
	query : null,
	filteredCommunities : computedFilterByQuery('communities', ['name','code'], 'query'),

	actions : {
		toggleCommunityMenu : function() {
			this.toggleProperty("showCommunityMenu");
		}
  	}
});
