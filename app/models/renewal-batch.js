import DS from 'ember-data';
import Ember from 'ember';

var calcSum = function(arr, prop) {
	var sum = arr.reduce(function(prev, itm) {
		return prev + itm.get(prop);
	}, 0);
	return sum;
};

var uniqueArray = function(target, prop) {
	var arr = [],
		uniqArr,
		emberArr = Ember.ArrayProxy.create({ content : Ember.A([])});
	target.forEach(function(itm) {
		arr = arr.concat(itm.get(prop));
	})
	uniqArr = arr.uniq(),

	uniqArr.forEach(function(itm) {
		emberArr.pushObject(Ember.Object.create({
			id : itm,
			text : itm
		}));
	});
	return emberArr;
};

export default DS.Model.extend({
	name : DS.attr("string"),
	startDate : DS.attr("momentDate"),
	endDate : DS.attr("momentDate"),
	month : DS.attr("string"),
	status : DS.attr("string", { defaultValue: "Open" }),
	communities : DS.hasMany("renewalComm", { async : true }),
	// units : DS.hasMany("renewalUnit", { async : true }),

	// Rolling up data from the Renewal Community objects
	expirationCount : Ember.computed("communities.@each.expirationCount", function() {
		return calcSum(this.get("communities"), "expirationCount");
	}),
	increaseSum : Ember.computed("communities.@each.increaseSum", function() {
		return calcSum(this.get("communities"), "increaseSum");
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
	totalNewDiscountToMarket : Ember.computed("communities.@each.totalNewDiscountToMarket", function() {
		return calcSum(this.get("communities"), "totalNewDiscountToMarket");
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
		return calcSum(this.get("communities"), "overrideCount");
	}),
	totalRecRent : Ember.computed("communities.@each.totalRecRent", function() {
		return calcSum(this.get("communities"), "totalRecRent");
	}),
	totalRecLeaseTerm : Ember.computed("communities.@each.totalRecLeaseTerm", function() {
		return calcSum(this.get("communities"), "totalRecLeaseTerm");
	}),

	// Averages
	avgIncrease : Ember.computed("expirationCount", "increaseSum", function() {
		return this.get("increaseSum") / this.get("expirationCount");
	}),
	avgRecRent : Ember.computed("totalRecRent", "expirationCount", function() {
		return this.get("totalRecRent") / this.get("expirationCount");
	}),
	avgRecTerm : Ember.computed("totalRecLeaseTerm", "expirationCount", function() {
		return this.get("totalRecTerm") / this.get("expirationCount");
	}),
	avgCurrentDiscountToMarket : Ember.computed("totalCurrentDiscountToMarket", "expirationCount", function() {
		return this.get("totalCurrentDiscountToMarket") / this.get("expirationCount");
	}),
	avgNewDiscountToMarket : Ember.computed("totalNewDiscountToMarket", "expirationCount", function() {
		return this.get("totalNewDiscountToMarket") / this.get("expirationCount");
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
	}),

	// Chart Data
	striation0 : 0,
	striation1 : 2,
	striation2 : 5,
	striation3 : 10,

	chartDataDtm : Ember.computed("communities.@each.chartDataDtm", function() {
		var arr = [0,0,0];
		this.get("communities").forEach(function(comm) {
			arr[0] += comm.get("chartDataDtm").objectAt(0);
			arr[1] += comm.get("chartDataDtm").objectAt(1);
			arr[2] += comm.get("chartDataDtm").objectAt(2);
		}, this);
		return arr;
	}),

	chartDataAvgInc : Ember.computed("communities.@each.avgIncrease", function() {
		var belowMktSum = 0,
			belowMktCount = 0,
			atMktSum = 0,
			atMktCount = 0,
			aboveMktSum = 0,
			aboveMktCount = 0,
			belowMktAvg, atMktAvg, aboveMktAvg, inc, dtm;

		this.get("communities").forEach(function(comm) {
			comm.get("units").forEach(function(unit) {
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
			}, this);
		}, this);

		belowMktAvg = Number(((belowMktSum / belowMktCount) * 100).toFixed(1));
		atMktAvg = Number(((atMktSum / atMktCount) * 100).toFixed(1)) || 0;
		aboveMktAvg = Number(((aboveMktSum / aboveMktCount) * 100).toFixed(1));

		return [belowMktAvg, atMktAvg, aboveMktAvg];
	}),

	chartData : Ember.computed("chartDataDtm", "chartDataAvgInc", function() {
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

	donutChartData : Ember.computed("communities.@each.allApproved", function() {
		var data = [],
			approved = 0,
			unapproved = 0;

		this.get("communities").forEach(function(comm) {
			comm.get("units").forEach(function(unit) {
				if( unit.get("approved") ) {
					approved += 1;
				} else {
					unapproved += 1;
				}
			});
		})

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

	chartDataCurrentDtm : Ember.computed("communities.@each.avgCurrentDiscountToMarket", function() {
		var data = [0,0,0,0,0,0,0,0,0],
			dtm,
			invDtm;

		this.get("communities").forEach(function(comm) {
			comm.get("units").forEach(function(unit) {
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
		}, this);

		return data;
	}),

	chartDataNewDtm : Ember.computed("communities.@each.avgNewDiscountToMarket", function() {
		var data = [0,0,0,0,0,0,0,0,0],
			dtm,
			invDtm;

		this.get("communities").forEach(function(comm) {
			comm.get("units").forEach(function(unit) {
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
		}, this);

		return data;
	}),

	chartDataDetailAvgInc : Ember.computed("communities.@each.avgIncrease", function() {
		var data = [],
			arr = [],
			inc, dtm, invDtm;

		for( var i = 0; i < 9; i++ ) {
			data[i] = { count : 0, sum : 0 };
		}

		this.get("communities").forEach(function(comm) {
			comm.get("units").forEach(function(unit) {
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
		}, this);

		for( var k = 0; k < data.length; k++ ) {
			arr[k] = Number(((data[k].sum / data[k].count) * 100).toFixed(1)) || 0;
		}

		return arr;
	}),

	detailChartData : Ember.computed("chartDataCurrentDtm", "chartDataNewDtm", "chartDataDetailAvgInc", function(){
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
