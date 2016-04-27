import Ember from 'ember';

export default Ember.Checkbox.extend({
	init : function() {
		this._super();
	},
	change : function() {
    	this._super(...arguments);
    	this.get('controller').send(this.get('action'), this.get("value"));
  	},
  	isComponentFactory : true
});
