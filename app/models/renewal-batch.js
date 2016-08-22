import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { belongsTo } from 'ember-data/relationships';
import Ember from 'ember';
import AggregationMixin from 'zion/mixins/aggregation';

var uniqueArray = function(target, prop) {
	var arr = [],
		uniqArr,
		emberArr = Ember.ArrayProxy.create({ content : Ember.A([])});
	target.forEach(function(itm) {
		arr = arr.concat(itm.get(prop));
	});
	uniqArr = arr.uniq();

	uniqArr.forEach(function(itm) {
		emberArr.pushObject(Ember.Object.create({
			id : itm,
			text : itm
		}));
	});
	return emberArr;
};

export default Model.extend(AggregationMixin, {
	name : attr("string"),
	startDate : attr("momentDate"),
	endDate : attr("momentDate"),
	month : attr("string"),
	status : attr("string", { defaultValue: "Open" }),
	createdBy : belongsTo("user", { async : true }),
	communities : hasMany("renewalComm", { async : true }),
	// ranges : hasMany("renewalRange", { async : true }),
	// units : hasMany("renewalUnit", { async : true }),

	isCommitted : Ember.computed("status", function() {
		if( this.get("status") === "Committed") {
			return true;
		} else {
			return false;
		}
	}),
	// Rolling up data from the Renewal Community objects
	expirationCount : Ember.computed("communities.@each.expirationCount", function() {
		return this.calcSum(this.get("communities"), "expirationCount");
	}),

	approvalCount : Ember.computed("communities.@each.approvalCount", function() {
		return this.calcSum(this.get("communities"), "approvalCount");
	}),
	increaseSum : Ember.computed("communities.@each.increaseSum", function() {
		return this.calcSum(this.get("communities"), "increaseSum");
	}),
	minIncrease : Ember.computed("communities.@each.minIncrease", function() {
		return this.getMin(this.get('communities'), 'minIncrease');
	}),
	maxIncrease : Ember.computed("communities.@each.maxIncrease", function() {
		return this.getMax(this.get('communities'), 'maxIncrease');
	}),
	totalCurrentDiscountToMarket : Ember.computed("communities.@each.totalCurrentDiscountToMarket", function() {
		return this.calcSum(this.get("communities"), "totalCurrentDiscountToMarket");
	}),
	totalNewDiscountToMarket : Ember.computed("communities.@each.totalNewDiscountToMarket", function() {
		return this.calcSum(this.get("communities"), "totalNewDiscountToMarket");
	}),
	minCurrentDiscountToMarket : Ember.computed("communities.@each.minCurrentDiscountToMarket", function() {
		return this.getMin(this.get("communities"), 'minCurrentDiscountToMarket');
	}),
	maxCurrentDiscountToMarket : Ember.computed("communities.@each.maxCurrentDiscountToMarket", function() {
		return this.getMax(this.get("communities"), 'maxCurrentDiscountToMarket');
	}),
	minNewDiscountToMarket : Ember.computed("communities.@each.minNewDiscountToMarket", function() {
		return this.getMin(this.get("communities"), 'minNewDiscountToMarket');
	}),
	maxNewDiscountToMarket : Ember.computed("communities.@each.maxNewDiscountToMarket", function() {
		return this.getMax(this.get("communities"), 'maxNewDiscountToMarket');
	}),
	readyForCommit : Ember.computed("communities.@each.allApproved", function() {
		var unapproved = this.get("communities").findBy("allApproved", false);
		if( unapproved ) {
			return false;
		} else {
			return true;
		}
	}),
	overrideCount : Ember.computed("communities.@each.overrideCount", function() {
		return this.calcSum(this.get("communities"), "overrideCount");
	}),
	totalRecRent : Ember.computed("communities.@each.totalRecRent", function() {
		return this.calcSum(this.get("communities"), "totalRecRent");
	}),
	totalRecLeaseTerm : Ember.computed("communities.@each.totalRecLeaseTerm", function() {
		return this.calcSum(this.get("communities"), "totalRecLeaseTerm");
	}),
	totalCurrentRent : Ember.computed("communities.@each.totalCurrentRent", function() {
	  	return this.calcSum(this.get("communities"), "totalCurrentRent");
	}),
	totalCurrentLeaseTerm : Ember.computed("communities.@each.totalCurrentLeaseTerm", function() {
	  	return this.calcSum(this.get("communities"), "totalCurrentLeaseTerm");
	}),

	// Averages
	avgIncrease : Ember.computed("expirationCount", "increaseSum", function() {
		return this.calcAvg(this.get("increaseSum"), this.get("expirationCount"));
	}),
	avgRecRent : Ember.computed("totalRecRent", "expirationCount", function() {
		return this.calcAvg(this.get("totalRecRent"), this.get("expirationCount"));
	}),
	avgRecTerm : Ember.computed("totalRecLeaseTerm", "expirationCount", function() {
		return this.calcAvg(this.get("totalRecLeaseTerm"), this.get("expirationCount"));
	}),
	avgCurrentDiscountToMarket : Ember.computed("totalCurrentDiscountToMarket", "expirationCount", function() {
		return this.calcAvg(this.get("totalCurrentDiscountToMarket"), this.get("expirationCount"));
	}),
	avgNewDiscountToMarket : Ember.computed("totalNewDiscountToMarket", "expirationCount", function() {
		return this.calcAvg(this.get("totalNewDiscountToMarket"), this.get("expirationCount"));
	}),
	avgCurrentRent : Ember.computed("totalCurrentRent", "expirationCount", function() {
		return this.calcAvg(this.get("totalCurrentRent"), this.get("expirationCount"));
	}),
	avgCurrentLeaseTerm : Ember.computed("totalCurrentLeaseTerm", "expirationCount", function() {
		return this.calcAvg(this.get("totalCurrentLeaseTerm"), this.get("expirationCount"));
	}),

	// Dropdown List content
	beds : Ember.computed("communities.@each.beds", function() {
		return uniqueArray(this.get("communities"), "beds");
	}),
	baths : Ember.computed("communities.@each.baths", function() {
		return uniqueArray(this.get("communities"), "baths");
	}),
	unitTypes : Ember.computed("communities.@each.unitTypes", function() {
		return uniqueArray(this.get("communities"), "unitTypes");
	}),
	pmsUnitTypes : Ember.computed("communities.@each.pmsUnitTypes", function() {
		return uniqueArray(this.get("communities"), "pmsUnitTypes");
	}),
	communityNames : Ember.computed("communities.@each.communityNames", function() {
		return uniqueArray(this.get("communities"), "communityNames");
	})

});
