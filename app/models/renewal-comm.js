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
	communityName : Ember.computed("community", function() {
		return this.get("community.name");
	}),
	communityFullName : Ember.computed("community", function() {
		return this.get("community.fullName");
	}),
	batch : DS.belongsTo("renewalBatch", { async : true }),
	units : DS.hasMany("renewalUnit", { async : true }),
	expirationCount : Ember.computed('units.[]', function() {
  		return this.get("units.length");
  	}),
	expirationPct : Ember.computed("expirationCount", "unitCount", function() {
	    return this.get("expirationCount") / this.get("unitCount");
	}),
	totalRecRent : Ember.computed("units.@each.finalRecRent", function() {
	  	return calcSum(this.get("units"), "finalRecRent");
	}),
	avgRecRent : Ember.computed("totalRecRent", "expirationCount", function() {
	  	return this.get("totalRecRent") / this.get("expirationCount");
	}),
	increaseSum : Ember.computed("units.@each.userIncreasePct", function() {
	  	return calcSum(this.get("units"), "userIncreasePct");
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
	minIncrease : Ember.computed("units.@each.userIncreasePct", function() {
		return this.get("units").reduce(function(prev, itm) {
			return (prev < itm.get("userIncreasePct") ? prev : itm.get('userIncreasePct'));
		}, this.get("units.firstObject.userIncreasePct"));
	}),
	maxIncrease : Ember.computed("units.@each.userIncreasePct", function() {
		return this.get("units").reduce(function(prev, itm) {
			return (prev > itm.get("userIncreasePct") ? prev : itm.get('userIncreasePct'));
		}, this.get("units.firstObject.userIncreasePct"));
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
	minNewDiscountToMarket : Ember.computed("units.@each.finalDiscountToMarket", function() {
		return this.get("units").reduce(function(prev, itm) {
			return (prev < itm.get("finalDiscountToMarket") ? prev : itm.get('finalDiscountToMarket'));
		}, this.get("units.firstObject.finalDiscountToMarket"));
	}),
	maxNewDiscountToMarket : Ember.computed("units.@each.finalDiscountToMarket", function() {
		return this.get("units").reduce(function(prev, itm) {
			return (prev > itm.get("finalDiscountToMarket") ? prev : itm.get('finalDiscountToMarket'));
		}, this.get("units.firstObject.finalDiscountToMarket"));
	}),
	approvalCount : Ember.computed("units.@each.approved", function() {
		return calcSum(this.get("units"), "approved");
	}),
	allApproved : Ember.computed("units.@each.approved", function() {
		var unapproved = this.get("units").findBy("approved", false);
		if( unapproved ) {
			return false
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
	}),

	// Chart data
	chartDataDtm : Ember.computed("units.@each.currentDiscountToMarket", function() {
		var belowMkt = 0,
			atMkt = 0,
			aboveMkt = 0;

		this.get("units").forEach(function(unit) {
			if( unit.get("currentDiscountToMarket") > 0 ) {
				aboveMkt += 1;
			} else if ( unit.get("currentDiscountToMarket") < 0 ) {
				belowMkt += 1;
			} else {
				atMkt += 1;
			}
		});

		return [belowMkt, atMkt, aboveMkt];
	}),
	chartDataAvgInc : Ember.computed("units.@each.finalRecRent", function() {
		var belowMktSum = 0,
			belowMktCount = 0,
			atMktSum = 0,
			atMktCount = 0,
			aboveMktSum = 0,
			aboveMktCount = 0,
			belowMktAvg, atMktAvg, aboveMktAvg, inc, dtm;

		this.get("units").forEach(function(unit) {
			inc = unit.get("userIncreasePct");
			dtm = unit.get("currentDiscountToMarket");
			if( dtm > 0 ) {
				aboveMktCount += 1;
				aboveMktSum += inc;
			} else if ( dtm < 0 ) {
				belowMktCount += 1;
				belowMktSum += inc;
			} else {
				atMktCount += 1;
				atMktSum += inc;
			}
		});

		belowMktAvg = Number(((belowMktSum / belowMktCount) * 100).toFixed(1)) || 0;
		atMktAvg = Number(((atMktSum / atMktCount) * 100).toFixed(1)) || 0;
		aboveMktAvg = Number(((aboveMktSum / aboveMktCount) * 100).toFixed(1)) || 0;

		return [belowMktAvg, atMktAvg, aboveMktAvg];
	}),

  	chartData : Ember.computed("units.@each.finalRecRent", function(){
		var content = [];

		// The Unit counts by Below, At, Above Market Series
		var counts = {
			name : "Current Rents",
			type : "column",
			data : this.get("chartDataDtm")
		};

		// The Average Increase Series
		var avgInc = {
			name : "Avg. Increase",
			type : "spline",
			yAxis : 1,
			tooltip: {
                valueSuffix: '%'
            },
			data : this.get("chartDataAvgInc")
		};

		// Push the series into the array
		content.push(counts);
		content.push(avgInc);

		return content;
	}),
	donutChartData : Ember.computed("units.@each.approved", function() {

		var data = [],
			approved = 0,
			unapproved = 0;

		this.get("units").forEach(function(unit) {
			// console.log(unit);
			if( unit.get("approved") ) {
				approved += 1;
			} else {
				unapproved += 1;
			}
		});

		data.push({
			name : "Approved",
			y : approved,
			color : "rgb(81, 188, 106)"
		});

		data.push({
			name : "Unapproved",
			y : unapproved,
			color : "rgba(81, 188, 106, 0.5)"
		});

		return [{
			type : "pie",
			name : "Approvals",
			innerSize : "70%",
			data : data
		}];
	}),

	striation0 : 0,
	striation1 : 2,
	striation2 : 5,
	striation3 : 10,

	chartDataCurrentDtm : Ember.computed("units.@each.currentDiscountToMarket", function() {
		var data = [0,0,0,0,0,0,0,0,0],
			dtm,
			invDtm;

		this.get("units").forEach(function(unit) {
			dtm = unit.get("currentDiscountToMarket") * 100;
			invDtm = -1 * dtm;
			if( invDtm >= this.get("striation3") ) {
				data[0] += 1;
			} else if( invDtm >= this.get("striation2") && invDtm < this.get("striation3") ) {
				data[1] += 1;
			} else if( invDtm >= this.get("striation1") && invDtm < this.get("striation2") ) {
				data[2] += 1;
			} else if( invDtm > this.get("striation0") && invDtm < this.get("striation1") ) {
				data[3] += 1;
			} else if( dtm === this.get("striation0") ) {
				data[4] += 1;
			} else if( dtm > this.get("striation0") && dtm < this.get("striation1") ) {
				data[5] += 1;
			} else if( dtm >= this.get("striation1") && dtm < this.get("striation2") ) {
				data[6] += 1;
			} else if( dtm >= this.get("striation2") && dtm < this.get("striation3") ) {
				data[7] += 1;
			} else if( dtm >= this.get("striation3") ) {
				data[8] += 1;
			}
		}, this);

		return data;
	}),

	chartDataNewDtm : Ember.computed("units.@each.finalRecRent", function() {
		var data = [0,0,0,0,0,0,0,0,0],
			dtm,
			invDtm;

		this.get("units").forEach(function(unit) {
			dtm = unit.get("finalDiscountToMarket") * 100;
			invDtm = -1 * dtm;
			if( invDtm >= this.get("striation3") ) {
				data[0] += 1;
			} else if( invDtm >= this.get("striation2") && invDtm < this.get("striation3") ) {
				data[1] += 1;
			} else if( invDtm >= this.get("striation1") && invDtm < this.get("striation2") ) {
				data[2] += 1;
			} else if( invDtm > this.get("striation0") && invDtm < this.get("striation1") ) {
				data[3] += 1;
			} else if( dtm === this.get("striation0") ) {
				data[4] += 1;
			} else if( dtm > this.get("striation0") && dtm < this.get("striation1") ) {
				data[5] += 1;
			} else if( dtm >= this.get("striation1") && dtm < this.get("striation2") ) {
				data[6] += 1;
			} else if( dtm >= this.get("striation2") && dtm < this.get("striation3") ) {
				data[7] += 1;
			} else if( dtm >= this.get("striation3") ) {
				data[8] += 1;
			}
		}, this);

		return data;
	}),

	chartDataDetailAvgInc : Ember.computed("units.@each.finalRecRent", function() {
		var data = [],
			arr = [],
			inc, dtm, invDtm;

		for( var i = 0; i < 9; i++ ) {
			data[i] = { count : 0, sum : 0 };
		}

		this.get("units").forEach(function(unit) {
			dtm = unit.get("currentDiscountToMarket") * 100;
			inc = unit.get("userIncreasePct");
			invDtm = -1 * dtm;
			if( invDtm >= this.get("striation3") ) {
				data[0].count += 1;
				data[0].sum += inc;
			} else if( invDtm >= this.get("striation2") && invDtm < this.get("striation3") ) {
				data[1].count += 1;
				data[1].sum += inc;
			} else if( invDtm >= this.get("striation1") && invDtm < this.get("striation2") ) {
				data[2].count += 1;
				data[2].sum += inc;
			} else if( invDtm > this.get("striation0") && invDtm < this.get("striation1") ) {
				data[3].count += 1;
				data[3].sum += inc;
			} else if( dtm === this.get("striation0") ) {
				data[4].count += 1;
				data[4].sum += inc;
			} else if( dtm > this.get("striation0") && dtm < this.get("striation1") ) {
				data[5].count += 1;
				data[5].sum += inc;
			} else if( dtm >= this.get("striation1") && dtm < this.get("striation2") ) {
				data[6].count += 1;
				data[6].sum += inc;
			} else if( dtm >= this.get("striation2") && dtm < this.get("striation3") ) {
				data[7].count += 1;
				data[7].sum += inc;
			} else if( dtm >= this.get("striation3") ) {
				data[8].count += 1;
				data[8].sum += inc;
			}
		}, this);

		for( var k = 0; k < data.length; k++ ) {
			arr[k] = Number(((data[k].sum / data[k].count) * 100).toFixed(1)) || 0;
		}

		return arr;
	}),

	detailChartData : Ember.computed("units.@each.finalRecRent", function(){
		var content = [];

		// The Unit counts by Below, At, Above Market Series
		var currentCounts = {
			name : "Current Rents",
			type : "column",
			data : this.get("chartDataCurrentDtm")
		};

		var newCounts = {
			name : "New Rents",
			type : "column",
			data : this.get("chartDataNewDtm")
		};

		// The Average Increase Series
		var avgInc = {
			name : "Avg. Increase",
			type : "spline",
			yAxis : 1,
			tooltip: {
                valueSuffix: '%'
            },
			data : this.get("chartDataDetailAvgInc"),
			zIndex : 3
		};

		// Push the series into the array
		content.push(currentCounts);
		content.push(avgInc);
		content.push(newCounts);


		return content;
	}),

});
