import Ember from 'ember';

export default Ember.Component.extend({
	tagName : "section",
	classNames : ["table"],

	actions : {
		delete(prop) {
			this.sendAction("delete", prop);
		}
	}
});
