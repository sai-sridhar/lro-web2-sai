import Ember from 'ember';

export default Ember.Component.extend({
	tagName : "section",
	classNames : ["user"],
	isNewUser : false,

	actions : {
		saveUser : function() {
			// var store = this.get("store");
			this.get("model").save().then(() => {
				this.sendAction("save");
			});
		},
		cancel : function() {
			this.sendAction("cancel");
		},
		deleteUser : function() {

			this.get("model").deleteRecord();
			this.get("model").save().then( () => {
				this.sendAction("cancel");
			});
		}
	}
});
