import Ember from 'ember';

export default Ember.Mixin.create({
	calcSum : function(arr, prop) {
		var sum = arr.reduce(function(prev, itm) {
			return prev + itm.get(prop);
		}, 0);
		return sum;
	},

	calcAvg : function(total, count) {
		if( count === 0) {
			return 0;
		} else {
			return total / count;
		}
	},

	getMin : function(arr, prop) {
		if( arr.get("firstObject") ) {
			var firstObj = arr.get("firstObject");
			if( arr.get("length") > 1 ) {
				return arr.reduce(function(prev, itm) {
					return (prev < itm.get(prop) ? prev : itm.get(prop));
				}, firstObj.get(prop));
			} else {
				return firstObj.get(prop);
			}
		} else {
			return 0;
		}
	},

	getMax : function(arr, prop) {
		if( arr.get("firstObject") ) {
			var firstObj = arr.get("firstObject");
			if( arr.get("length") > 1 ) {
				return arr.reduce(function(prev, itm) {
					return (prev > itm.get(prop) ? prev : itm.get(prop));
				}, firstObj.get(prop));
			} else {
				return firstObj.get(prop);
			}
		} else {
			return 0;
		}
	}
});
