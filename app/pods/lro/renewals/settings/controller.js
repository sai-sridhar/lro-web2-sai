import Ember from 'ember';

var emberfyTextArray = function(arr) {
	var content = Ember.ArrayProxy.create({ content : Ember.A([])}),
		newObj;

	for( var i = 0; i < arr.length; i++) {
		newObj = Ember.Object.create({
			id : arr[i],
			text : arr[i]
		});
		content.pushObject(newObj);
	}
	return content;
};

export default Ember.Controller.extend({
	batchFrequency : Ember.computed(function() {
		return emberfyTextArray(["Daily", "Weekly", "Semi-monthly", "Monthly"]);
	})
});
