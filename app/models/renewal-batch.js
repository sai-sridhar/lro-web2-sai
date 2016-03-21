import DS from 'ember-data';
import Ember from 'ember';

var calcSum = function(arr, prop) {
	var sum = arr.reduce(function(prev, itm) {
		return prev + itm.get(prop);
	}, 0);
	return sum;
};

export default DS.Model.extend({
	name : DS.attr("string"),
	startDate : DS.attr("momentDate"),
	endDate : DS.attr("momentDate"),
	month : DS.attr("string"),
	status : DS.attr("string", { defaultValue: "Open" }),
	communities : DS.hasMany("renewalComm", { async : true }),
	units : DS.hasMany("renewalUnit", { async : true }),

	expirationCount : Ember.computed("communities.@each.expirationCount", function() {
		return calcSum(this.get("communities"), "expirationCount");
	}),
	increaseSum : Ember.computed("communities.@each.increaseSum", function() {
		return calcSum(this.get("communities"), "increaseSum");
	}),
	avgIncrease : Ember.computed("expirationCount", "increaseSum", function() {
		return this.get("increaseSum") / this.get("expirationCount");
	}),
	minIncrease : Ember.computed("communities.@each.minIncrease", function() {
		return this.get("communities").reduce(function(prev, itm) {
			return (prev < itm.get("minIncrease") ? prev : itm.get('minIncrease'));
		}, this.get("communities.firstObject.minIncrease"));
	}),
	maxIncrease : Ember.computed("communities.@each.maxIncrease", function() {
		return this.get("communities").reduce(function(prev, itm) {
			return (prev > itm.get("maxIncrease") ? prev : itm.get('maxIncrease'));
		}, this.get("communities.firstObject.maxIncrease"));
	}),
	totalCurrentDiscountToMarket : Ember.computed("communities.@each.totalCurrentDiscountToMarket", function() {
		return calcSum(this.get("communities"), "totalCurrentDiscountToMarket");
	}),
	avgCurrentDiscountToMarket : Ember.computed("totalCurrentDiscountToMarket", "expirationCount", function() {
		return this.get("totalCurrentDiscountToMarket") / this.get("expirationCount");
	}),
	totalNewDiscountToMarket : Ember.computed("communities.@each.totalNewDiscountToMarket", function() {
		return calcSum(this.get("communities"), "totalNewDiscountToMarket");
	}),
	avgNewDiscountToMarket : Ember.computed("totalNewDiscountToMarket", "expirationCount", function() {
		return this.get("totalNewDiscountToMarket") / this.get("expirationCount");
	}),
	minCurrentDiscountToMarket : Ember.computed("communities.@each.minCurrentDiscountToMarket", function() {
		return this.get("communities").reduce(function(prev, itm) {
			return (prev < itm.get("minCurrentDiscountToMarket") ? prev : itm.get('minCurrentDiscountToMarket'));
		}, this.get("communities.firstObject.minCurrentDiscountToMarket"));
	}),
	maxCurrentDiscountToMarket : Ember.computed("communities.@each.maxCurrentDiscountToMarket", function() {
		return this.get("communities").reduce(function(prev, itm) {
			return (prev > itm.get("maxCurrentDiscountToMarket") ? prev : itm.get('maxCurrentDiscountToMarket'));
		}, this.get("communities.firstObject.maxCurrentDiscountToMarket"));
	}),
	minNewDiscountToMarket : Ember.computed("communities.@each.minNewDiscountToMarket", function() {
		return this.get("communities").reduce(function(prev, itm) {
			return (prev < itm.get("minNewDiscountToMarket") ? prev : itm.get('minNewDiscountToMarket'));
		}, this.get("communities.firstObject.minNewDiscountToMarket"));
	}),
	maxNewDiscountToMarket : Ember.computed("communities.@each.maxNewDiscountToMarket", function() {
		return this.get("communities").reduce(function(prev, itm) {
			return (prev > itm.get("maxNewDiscountToMarket") ? prev : itm.get('maxNewDiscountToMarket'));
		}, this.get("communities.firstObject.maxNewDiscountToMarket"));
	})
});
