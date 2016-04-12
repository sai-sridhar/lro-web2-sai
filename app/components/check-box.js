import Ember from 'ember';

export default Ember.Checkbox.extend({
	change : function() {
    	this._super(...arguments);
    	this.get('controller').send(this.get('action'), this.get("value"));
  	}
});
