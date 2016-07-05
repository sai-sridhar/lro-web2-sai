import Ember from 'ember';

export default Ember.Component.extend({
	allowClear : true,
	selectMultiple : false,
	selectAll : false,

	placeholder : Ember.computed("selectMultiple", function() {
		if( this.get("selectMultiple") ) {
			return "Select communities...";
		} else {
			return "Select community...";
		}
	}),

	actions : {
		selectAllCommunities : function() {
			this.set("selectedCommunities", []);
			this.get("content").forEach(function(comm) {
				this.get("selectedCommunities").pushObject(comm);
			}, this);
		},
		deselectAllCommunities : function() {
			this.set("selectedCommunities", []);
		}
	}
});
