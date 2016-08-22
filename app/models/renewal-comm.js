import Model from 'ember-data/model';
import Ember from 'ember';
import { belongsTo } from 'ember-data/relationships';
import { hasMany } from 'ember-data/relationships';
import AggregationMixin from 'zion/mixins/aggregation';

export default Model.extend(AggregationMixin, {
	community : belongsTo("community", { async : true }),
	communityName : Ember.computed("community", function() {
		return this.get("community.name");
	}),
	communityCode : Ember.computed("community", function() {
		return this.get("community.code");
	}),
	communityFullName : Ember.computed("community", function() {
		return this.get("community.fullName");
	}),
	batch : belongsTo("renewalBatch", { async : true }),
	units : hasMany("renewalUnit", { async : true }),
	expirationCount : Ember.computed('units.[]', function() {
  		return this.get("units.length");
  	}),
	expirationPct : Ember.computed("expirationCount", "unitCount", function() {
	    return this.get("expirationCount"), this.get("unitCount");
	}),
	totalRecRent : Ember.computed("units.@each.finalRecRent", function() {
	  	return this.calcSum(this.get("units"), "finalRecRent");
	}),
	avgRecRent : Ember.computed("totalRecRent", "expirationCount", function() {
	  	return this.calcAvg(this.get("totalRecRent"), this.get("expirationCount"));
	}),
	increaseSum : Ember.computed("units.@each.userIncreasePct", function() {
	  	return this.calcSum(this.get("units"), "userIncreasePct");
	}),
	avgIncrease : Ember.computed("expirationCount", "increaseSum", function() {
	  	return this.calcAvg(this.get("increaseSum"), this.get("expirationCount"));
	}),
	totalRecLeaseTerm : Ember.computed("units.@each.recLeaseTerm", function() {
	  	return this.calcSum(this.get("units"), "recLeaseTerm");
	}),
	avgRecLeaseTerm : Ember.computed("totalRecLeaseTerm", "expirationCount", function() {
	  	return this.calcAvg(this.get("totalRecLeaseTerm"), this.get("expirationCount"));
	}),
	totalCurrentRent : Ember.computed("units.@each.currentRent", function() {
	  	return this.calcSum(this.get("units"), "currentRent");
	}),
	avgCurrentRent : Ember.computed("totalCurrentRent", "expirationCount", function() {
	  	return this.calcAvg(this.get("totalCurrentRent"), this.get("expirationCount"));
	}),
	totalCurrentLeaseTerm : Ember.computed("units.@each.currentLeaseTerm", function() {
	  	return this.calcSum(this.get("units"), "currentLeaseTerm");
	}),
	avgCurrentLeaseTerm : Ember.computed("totalCurrentLeaseTerm", "expirationCount", function() {
	  	return this.calcAvg(this.get("totalCurrentLeaseTerm"), this.get("expirationCount"));
	}),
	totalCurrentDiscountToMarket : Ember.computed("units.@each.currentDiscountToMarket", function() {
		return this.calcSum(this.get("units"), "currentDiscountToMarket");
	}),
	avgCurrentDiscountToMarket : Ember.computed("totalCurrentDiscountToMarket", "expirationCount", function() {
		return this.calcAvg(this.get("totalCurrentDiscountToMarket"), this.get("expirationCount"));
	}),
	totalNewDiscountToMarket : Ember.computed("units.@each.newDiscountToMarket", function() {
		return this.calcSum(this.get("units"), "newDiscountToMarket");
	}),
	avgNewDiscountToMarket : Ember.computed("totalNewDiscountToMarket", "expirationCount", function() {
		return this.calcAvg(this.get("totalNewDiscountToMarket"), this.get("expirationCount"));
	}),
	minIncrease : Ember.computed("units.@each.userIncreasePct", function() {
		return this.getMin(this.get("units"), 'userIncreasePct');
	}),
	maxIncrease : Ember.computed("units.@each.userIncreasePct", function() {
		return this.getMax(this.get("units"), 'userIncreasePct');
	}),
	minCurrentDiscountToMarket : Ember.computed("units.@each.currentDiscountToMarket", function() {
		return this.getMin(this.get("units"), 'currentDiscountToMarket');
	}),
	maxCurrentDiscountToMarket : Ember.computed("units.@each.currentDiscountToMarket", function() {
		return this.getMax(this.get("units"), 'currentDiscountToMarket');
	}),
	minNewDiscountToMarket : Ember.computed("units.@each.finalDiscountToMarket", function() {
		return this.getMin(this.get("units"), 'finalDiscountToMarket');
	}),
	maxNewDiscountToMarket : Ember.computed("units.@each.finalDiscountToMarket", function() {
		return this.getMax(this.get("units"), 'finalDiscountToMarket');
	}),
	approvalCount : Ember.computed("units.@each.approved", function() {
		return this.calcSum(this.get("units"), "approved");
	}),
	allApproved : Ember.computed("units.@each.approved", function() {
		var unapproved = this.get("units").findBy("approved", false);
		if( unapproved ) {
			return false;
		} else {
			return true;
		}
	}),
	overrideCount : Ember.computed("units.@each.userOverrideMode", function() {
		var nonOverride = this.get("units").filterBy("userOverrideMode", null);
		return (this.get("units.length") - nonOverride.length) || 0;
	}),
	unitTypes : Ember.computed("units.@each.unitType", function() {
		var arr = this.get("units").mapBy("unitType");
		var uniqArr = arr.uniq();
		return uniqArr;
	}),
	pmsUnitTypes : Ember.computed("units.@each.pmsUnitType", function() {
		var arr = this.get("units").mapBy("pmsUnitType");
		var uniqArr = arr.uniq();
		return uniqArr;
	}),
	beds : Ember.computed("units.@each.beds", function() {
		var arr = this.get("units").mapBy("beds");
		var uniqArr = arr.uniq();
		return uniqArr;
	}),
	baths : Ember.computed("units.@each.baths", function() {
		var arr = this.get("units").mapBy("baths");
		var uniqArr = arr.uniq();
		return uniqArr;
	}),
	communityNames : Ember.computed("units.@each.communityName", function() {
		var arr = this.get("units").mapBy("communityName");
		var uniqArr = arr.uniq();
		return uniqArr;
	})

});
