import Ember from 'ember';

export default Ember.Component.extend({
	allowClear : true,
	selectMultiple : false,
	selectAll : false,
	displayProp : "text",
	placeholderSingle : "Select...",
	placeholderPlural : "Select...",

	placeholder : Ember.computed("selectMultiple", function() {
		if( this.get("selectMultiple") ) {
			return this.get("placeholderPlural");
		} else {
			return this.get("placeholderSingle");
		}
	}),

	actions : {
		selectAll : function() {
			this.set("selectedObjects", []);
			this.get("content").forEach(function(itm) {
				this.get("selectedObjects").pushObject(itm);
			}, this);
		},
		deselectAll : function() {
			this.set("selectedObjects", []);
		}
	}
});
