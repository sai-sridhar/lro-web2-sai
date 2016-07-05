import Ember from 'ember';

export default Ember.Component.extend({

	switched : true,
	orientation : false,
	label : null,
	toggleOnly : false,
	onColor: "green",
	offColor: "gray",

	block : Ember.computed('orientation', function() {
		if( this.get("orientation") === "block" ) {
			return true;
		} else if( this.get("orientation") === "inline" ) {
			return false;
		} else {
			return false;
		}
	}),

	actions : {
		toggle : function() {
			this.toggleProperty("switched");
		}
	}
});
