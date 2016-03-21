import DS from 'ember-data';
import Ember from 'ember';

var calcSum = function(arr, prop) {
	var sum = arr.reduce(function(prev, itm) {
		return prev + itm.get(prop);
	}, 0);
	return sum;
};

export default DS.Model.extend({
	community : DS.belongsTo("community", { async : true }),
	batch : DS.belongsTo("renewalBatch", { async : true }),
	units : DS.hasMany("renewalUnit", { async : true }),
	expirationCount : Ember.computed('units.[]', function() {
  		return this.get("units.length");
  	}),
	expirationPct : Ember.computed("expirationCount", "unitCount", function() {
	    return this.get("expirationCount") / this.get("unitCount");
	}),
	totalRecRent : Ember.computed("units.@each.recRent", function() {
	  	return calcSum(this.get("units"), "recRent");
	}),
	avgRecRent : Ember.computed("totalRecRent", "expirationCount", function() {
	  	return this.get("totalRecRent") / this.get("expirationCount");
	}),
	increaseSum : Ember.computed("units.@each.increase", function() {
	  	return calcSum(this.get("units"), "increase");
	}),
	avgIncrease : Ember.computed("expirationCount", "increaseSum", function() {
	  	return this.get("increaseSum") / this.get("expirationCount");
	}),
	totalRecLeaseTerm : Ember.computed("units.@each.recLeaseTerm", function() {
	  	return calcSum(this.get("units"), "recLeaseTerm");
	}),
	avgRecLeaseTerm : Ember.computed("totalRecLeaseTerm", "expirationCount", function() {
	  	return this.get("totalRecLeaseTerm") / this.get("expirationCount");
	}),
	totalCurrentRent : Ember.computed("units.@each.currentRent", function() {
	  	return calcSum(this.get("units"), "currentRent");
	}),
	avgCurrentRent : Ember.computed("totalCurrentRent", "expirationCount", function() {
	  	return this.get("totalCurrentRent") / this.get("expirationCount");
	}),
	totalCurrentLeaseTerm : Ember.computed("units.@each.currentLeaseTerm", function() {
	  	return calcSum(this.get("units"), "currentLeaseTerm");
	}),
	avgCurrentLeaseTerm : Ember.computed("totalCurrentLeaseTerm", "expirationCount", function() {
	  	return this.get("totalCurrentLeaseTerm") / this.get("expirationCount");
	}),
	totalCurrentDiscountToMarket : Ember.computed("units.@each.currentDiscountToMarket", function() {
		return calcSum(this.get("units"), "currentDiscountToMarket");
	}),
	avgCurrentDiscountToMarket : Ember.computed("totalCurrentDiscountToMarket", "expirationCount", function() {
		return this.get("totalCurrentDiscountToMarket") / this.get("expirationCount");
	}),
	totalNewDiscountToMarket : Ember.computed("units.@each.newDiscountToMarket", function() {
		return calcSum(this.get("units"), "newDiscountToMarket");
	}),
	avgNewDiscountToMarket : Ember.computed("totalNewDiscountToMarket", "expirationCount", function() {
		return this.get("totalNewDiscountToMarket") / this.get("expirationCount");
	}),
	minIncrease : Ember.computed("units.@each.increase", function() {
		return this.get("units").reduce(function(prev, itm) {
			return (prev < itm.get("increase") ? prev : itm.get('increase'));
		}, this.get("units.firstObject.increase"));
	}),
	maxIncrease : Ember.computed("units.@each.increase", function() {
		return this.get("units").reduce(function(prev, itm) {
			return (prev > itm.get("increase") ? prev : itm.get('increase'));
		}, this.get("units.firstObject.increase"));
	}),
	minCurrentDiscountToMarket : Ember.computed("units.@each.currentDiscountToMarket", function() {
		return this.get("units").reduce(function(prev, itm) {
			return (prev < itm.get("currentDiscountToMarket") ? prev : itm.get('currentDiscountToMarket'));
		}, this.get("units.firstObject.currentDiscountToMarket"));
	}),
	maxCurrentDiscountToMarket : Ember.computed("units.@each.currentDiscountToMarket", function() {
		return this.get("units").reduce(function(prev, itm) {
			return (prev > itm.get("currentDiscountToMarket") ? prev : itm.get('currentDiscountToMarket'));
		}, this.get("units.firstObject.currentDiscountToMarket"));
	}),
	minNewDiscountToMarket : Ember.computed("units.@each.newDiscountToMarket", function() {
		return this.get("units").reduce(function(prev, itm) {
			return (prev < itm.get("newDiscountToMarket") ? prev : itm.get('newDiscountToMarket'));
		}, this.get("units.firstObject.newDiscountToMarket"));
	}),
	maxNewDiscountToMarket : Ember.computed("units.@each.newDiscountToMarket", function() {
		return this.get("units").reduce(function(prev, itm) {
			return (prev > itm.get("newDiscountToMarket") ? prev : itm.get('newDiscountToMarket'));
		}, this.get("units.firstObject.newDiscountToMarket"));
	})

});
