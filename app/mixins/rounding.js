import Ember from 'ember';

export default Ember.Mixin.create({
	round : function(val, dp) {
		var multiplier = Math.pow(10, dp);

		return +(Math.round(val * multiplier) / multiplier);
	}
});
