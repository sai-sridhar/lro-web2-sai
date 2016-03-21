import Ember from 'ember';

export default Ember.Component.extend({
	isText : Ember.computed('type', function() {
		if( this.get("type") === "text" ) {
			return true;
		} else {
			return false;
		}
	}),
	isCal : Ember.computed('type', function() {
		if( this.get("type") === "cal" ) {
			return true;
		} else {
			return false;
		}
	}),
	isNumber : Ember.computed('type', function() {
		if( this.get("type") === "number" ) {
			return true;
		} else {
			return false;
		}
	}),
	isList : Ember.computed('type', function() {
		if( this.get("type") === "list" ) {
			return true;
		} else {
			return false;
		}
	}),
	isToggle : Ember.computed('type', function() {
		if( this.get("type") === "toggle" ) {
			return true;
		} else {
			return false;
		}
	}),
});
