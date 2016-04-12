import Ember from 'ember';
import RoundingMixin from 'zion/mixins/rounding';

export default Ember.Controller.extend(RoundingMixin, {

	communityView : null,
	unitView : null,
	increaseMin : 0,
	increaseMax : 0,
	newDtmMin : 0,
	newDtmMax : 0,
	currentDtmMin : 0,
	currentDtmMax : 0,

	detailView : null,
	showDetailFilters : false,
	showParams : false,
	showTerms : false,
	queryParams : ["showDetailFilters", "detailView", "showParams", "showTerms"],

	actions : {
		toggleLtc : function(ltc) {
			ltc.get("terms").setEach("isChecked", ltc.get("isChecked"));
		},
		toggleLeaseTerm : function(ltc) {
			var allChecked = ltc.get("terms").reduce(function(prev, item) {
				if( item.get("isChecked") ) {
					return 1 + prev;
				} else {
					return prev;
				}
			}, 0);

			if( allChecked === ltc.get("terms.length") ) {
				ltc.set("isChecked", true)
			} else {
				ltc.set("isChecked", false);
			}
		}
	},

	leaseTermCategories : Ember.computed(function() {
		var content = Ember.ArrayProxy.create({ content : Ember.A([])});

		var ltcs = [
			{	ltc : "Month to month",
				terms : [
					{	term : 1,
						text : "Month to month"}
				]
			},
			{	ltc : "Short Terms",
				terms : [
					{	term : 2,
						text : "2 months"
					},
					{	term : 3,
						text : "3 months"
					},
					{	term : 4,
						text : "4 months"
					},
					{	term : 5,
						text : "5 months"
					}
				]
			},
			{	ltc : "Medium Terms",
				terms : [
					{	term : 6,
						text : "6 months"
					},
					{	term : 7,
						text : "7 months"
					},
					{	term : 8,
						text : "8 months"
					},
					{	term : 9,
						text : "9 months"
					}
				]
			},
			{	ltc : "Long Terms",
				terms : [
					{	term : 10,
						text : "10 months"
					},
					{	term : 11,
						text : "11 months"
					},
					{	term : 12,
						text : "12 months"
					}
				]
			}
		];

		for( var i = 0; i < ltcs.length; i++) {
			var newLtc = Ember.Object.create({
				ltc : ltcs[i].ltc,
				terms : Ember.ArrayProxy.create({ content : Ember.A([])})
			});

			for( var k = 0; k < ltcs[i].terms.length; k++ ) {
				var newTerm = Ember.Object.create({
					term : ltcs[i].terms[k].term,
					text : ltcs[i].terms[k].text
				});
				newLtc.get("terms").pushObject(newTerm);
			}
			content.pushObject(newLtc);
		}

		return content;
	}),

	detailViewObserver : Ember.observer("detailView", function() {
		if( this.get("detailView") === "community" ) {
			this.set("unitView", false);
			this.set("communityView", true);
		} else if( this.get("detailView") === "unit" ) {
			this.set("unitView", true);
			this.set("communityView", false);
		}
	}),

	increaseObserver : Ember.observer("model.minIncrease", "model.maxIncrease", function() {
		this.set("increaseMin", this.get("model.minIncrease") * 100);
		this.set("increaseMax", this.get("model.maxIncrease") * 100);

		this.set("increaseSliderStart", [this.get("increaseMin"), this.get("increaseMax")]);
		this.set("increaseRange", {
			min : this.get("increaseMin"),
			max : this.get("increaseMax")
		});
	}),

	currentDtmObserver : Ember.observer("model.minCurrentDiscountToMarket", "model.maxCurrentDiscountToMarket", function() {
		if( !(isNaN(this.get("model.minCurrentDiscountToMarket"))) ) {
			this.set("currentDtmMin", this.get("model.minCurrentDiscountToMarket") * 100);
			this.set("currentDtmMax", this.get("model.maxCurrentDiscountToMarket") * 100);
		}

		this.set("currentDtmSliderStart", [this.get("currentDtmMin"), this.get("currentDtmMax")]);
		this.set("currentDtmRange", {
			min : this.get("currentDtmMin"),
			max : this.get("currentDtmMax")
		});
	}),

	newDtmObserver : Ember.observer("model.minNewDiscountToMarket", "model.maxNewDiscountToMarket", function() {
		if( !(isNaN(this.get("model.minNewDiscountToMarket"))) ) {
			this.set("newDtmMin", this.get("model.minNewDiscountToMarket") * 100);
			this.set("newDtmMax", this.get("model.maxNewDiscountToMarket") * 100);
		} else {
			this.set("newDtmMin", -1);
			this.set("newDtmMax", 1);
		}

		this.set("newDtmSliderStart", [this.get("newDtmMin"), this.get("newDtmMax")]);
		this.set("newDtmRange", {
			min : this.get("newDtmMin"),
			max : this.get("newDtmMax")
		});
	}),

	unitsObserver : Ember.observer("content.units.[]", function(){

		// return;
		Ember.run.once(this, function() {

			var cols = ["beds", "baths", "unitType", "pmsUnitType"],
				filters = Ember.ArrayProxy.create({ content : Ember.A([])});

			for( var i = 0; i < cols.length; i++ ) {
				filters.pushObject(
					Ember.Object.create({
						key : cols[i],
						arr : Ember.ArrayProxy.create({ content : Ember.A([])}),
						prop : cols[i] + "Content"
					})
				);
			}

			this.get("content.units").forEach(function(unit) {
				filters.forEach(function(filter) {
					var val = unit.get(filter.get("key"));
					var b = filter.get("arr").findBy("name", val);
					if( !b ) {
						var newObj = Ember.Object.create({
							id : val,
							name : val,
							text : val
						});
						filter.get("arr").pushObject(newObj);
					}
				});
			});

			filters.forEach(function(filter) {
				this.set(filter.get("prop"), filter.get("arr"));
			}, this);

		}); // END run once
	}),

	filteredUnitContent : Ember.computed("increaseMin", "increaseMax", "newDtmMin", "newDtmMax", "currentDtmMin", "currentDtmMax", "communityFilter", "bedsFilter", "bathsFilter", "unitTypeFilter", "pmsUnitTypeFilter", "overrideUnitFilter", "unapprovedUnitFilter", "content.units.@each.userIncreasePct", function() {

		// return this.get("content.units");

		var incMin = this.round(this.get("increaseMin") / 100, 4),
			incMax = this.round(this.get("increaseMax") / 100, 4),
			inc,
			cDtmMin = this.round(this.get("currentDtmMin") / 100, 4),
			cDtmMax = this.round(this.get("currentDtmMax") / 100, 4),
			cDtm,
			nDtmMin = this.round(this.get("newDtmMin") / 100, 4),
			nDtmMax = this.round(this.get("newDtmMax") / 100, 4),
			nDtm,
			app;

		return this.get("content.units").filter(function(unit, i) {
			var f1 = true, // increase pct
				f2 = true, // beds
				f3 = true, // baths
				f4 = true, // unit type
				f5 = true, // pms unit type
				f6 = true, // overrides
				f7 = true, // current discount to market
				f8 = true, // new discount to market
				f9 = true, // unapproved units
				f10 = true; // community

				inc = this.round(unit.get("userIncreasePct"), 4);
				cDtm = this.round(unit.get("currentDiscountToMarket"), 4);
				nDtm = this.round(unit.get("finalDiscountToMarket"), 4);


			if( !(inc >= incMin && inc <= incMax) ) {
				f1 = false;
			}

			if( this.get("bedsFilter") ) {
				if( this.get("bedsFilter.id") !== 0 ) {
					if( this.get("bedsFilter.name") !== unit.get("beds") ) {
						f2 = false;
					}
				}
			}

			if( this.get("bathsFilter") ) {
				if( this.get("bathsFilter.id") !== 0 ) {
					if( this.get("bathsFilter.name") !== unit.get("baths") ) {
						f3 = false;
					}
				}
			}

			if( this.get("unitTypeFilter") ) {
				if( this.get("unitTypeFilter.id") !== 0 ) {
					if( this.get("unitTypeFilter.name") !== unit.get("unitType") ) {
						f4 = false;
					}
				}
			}

			if( this.get("pmsUnitTypeFilter") ) {
				if( this.get("pmsUnitTypeFilter.id") !== 0 ) {
					if( this.get("pmsUnitTypeFilter.name") !== unit.get("pmsUnitType") ) {
						f5 = false;
					}
				}
			}

			if( this.get("overrideUnitFilter") ) {
				if( !unit.get("userOverrideMode") ) {
					f6 = false;
				}
			}

			if( !(cDtm >= cDtmMin && cDtm <= cDtmMax) ) {
			 	f7 = false;
			}

			if( !(nDtm >= nDtmMin && nDtm <= nDtmMax) ) {
			 	f8 = false;
			}

			if( this.get("unapprovedUnitFilter") ) {
				if( unit.get("approved") ) {
					f9 = false;
				}
			}

			if( this.get("communityFilter") ) {
				if( unit.get("renewalComm.community.name") !== this.get("communityFilter.text") ) {
					f10 = false;
				}
			}

		 	// console.log(f1,f2,f3,f4,f5,f6,f7,f8,f9,f10, unit.get("id"));

			return (f1 && f2 && f3 && f4 && f5 && f6 && f7 && f8 && f9 && f10);
		}, this);
	}),

	unitFiltersApplied : Ember.computed("filteredUnitContent.length", function() {
		if( this.get("filteredUnitContent.length") === this.get("content.units.length") ) {
			return false;
		} else {
			return true;
		}
	}),

	avgIncreaseObserver : Ember.observer("content.communities.@each.avgIncrease", function() {
		// find the min
		var min = this.get("content.communities").reduce(function(prev, itm) {
			return (prev < itm.get("avgIncrease") ? prev : itm.get('avgIncrease'));
		}, this.get("content.communities.firstObject.avgIncrease"));

		// find the max
		var max = this.get("content.communities").reduce(function(prev, itm) {
			return (prev > itm.get("avgIncrease") ? prev : itm.get('avgIncrease'));
		}, this.get("content.communities.firstObject.avgIncrease"));

		this.set("avgIncreaseMin", min * 100);
		this.set("avgIncreaseMax", max * 100);

		this.set("avgIncreaseSliderStart", [this.get("avgIncreaseMin"), this.get("avgIncreaseMax")]);
		this.set("avgIncreaseRange", {
			min : this.get("avgIncreaseMin"),
			max : this.get("avgIncreaseMax")
		});
	}),

	filteredCommunityContent : Ember.computed("avgIncreaseMin", "avgIncreaseMax", "overrideCommunityFilter", "unapprovedCommunityFilter", "content.communities.@each.avgIncrease", function() {
		var avgIncMin = this.round(this.get("avgIncreaseMin") / 100, 4),
			avgIncMax = this.round(this.get("avgIncreaseMax") / 100, 4),
			avgInc;

		return this.get("content.communities").filter(function(comm) {
			var f1 = true, // avg increase pct
				f2 = true, // communities with unapproved units
				f3 = true; // communities with overrides

			avgInc = this.round(comm.get("avgIncrease"), 4);

			if( !(avgInc >= avgIncMin && avgInc <= avgIncMax) ) {
				f1 = false;
			}

			if( this.get("unapprovedCommunityFilter") ) {
				if( comm.get("allApproved") ) {
					f2 = false;
				}
			}

			if( this.get("overrideCommunityFilter") ) {
				if( !comm.get("overrideCount") ) {
					f3 = false;
				}
			}

			return (f1 && f2 && f3);
		}, this);
	}),

	communityFiltersApplied : Ember.computed("filteredCommunityContent.length", function() {
		if( this.get("filteredCommunityContent.length") === this.get("content.communities.length") ) {
			return false;
		} else {
			return true;
		}
	}),

	chartDataDtm : Ember.computed("content.units.[]", function() {

		var belowMkt = 0,
			atMkt = 0,
			aboveMkt = 0;

		this.get("content.units").forEach(function(unit) {
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

	chartDataAvgInc : Ember.computed("content.units.@each.finalRecRent", function() {
		var belowMktSum = 0,
			belowMktCount = 0,
			atMktSum = 0,
			atMktCount = 0,
			aboveMktSum = 0,
			aboveMktCount = 0,
			belowMktAvg, atMktAvg, aboveMktAvg, inc, dtm;

		this.get("content.units").forEach(function(unit) {
			inc = unit.get("lroIncreasePct");
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

		belowMktAvg = Number(((belowMktSum / belowMktCount) * 100).toFixed(1));
		atMktAvg = Number(((atMktSum / atMktCount) * 100).toFixed(1));
		aboveMktAvg = Number(((aboveMktSum / aboveMktCount) * 100).toFixed(1));

		return [belowMktAvg, atMktAvg, aboveMktAvg];
	}),

	chartMode: null, // Available options: a falsy value, 'StockChart', 'Map'.
                           // If `mode` is not provided or is a falsy value, the chart is initialized in Charts mode.
                           // If `mode` is a string, it is passed to Highcharts as the first argument.
                           // When Highcharts introduces a new mode, you will be able to use it here right away.

	chartOptions: {
		chart: {
			// type: 'column',
			zoomType: 'none', // 'x', 'y', 'xy' or 'none'
			style : {
				fontFamily : "Avenir"
			},
			height: 300
		},
		title: {
			text: ''
		},
		xAxis: [{
			categories: ['Below Market', 'At Market', 'Above Market'],
			crosshair : true,
			labels : {
				align : "center",
				autoRotation : 0
			}
		}],
		yAxis: [
			{	// Primary Axis
				title: {
					text: 'Unit Count'
				}
    		},
    		{	// Secondary Axis
    			title : {
    				text : "Increase %"
    			},
				labels : {
					format : "{value}%"
				},
    			opposite : true
    		}
    	],
    	tooltip : {
    		shared : true,
    		backgroundColor : "rgba(255,255,255,1)",
    	},
    	legend: {
			layout: 'horizontal',
			align: 'center',
			x: 0,
			verticalAlign: 'top',
			y: 0,
			floating: false,
        }
  	},

	chartData : Ember.computed("content.units.@each.finalRecRent", function(){
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

	donutChartOptions : {
		chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            height: 200,
            style : {
				fontFamily : "Avenir"
			},
        },

        title: {
            text: 'Approvals',
            align: 'center',
            verticalAlign: 'middle',
            y: 0
        },

        tooltip: {
        	backgroundColor : "rgba(255,255,255,1)",
            pointFormat: '<b>{point.y}</b> ({point.percentage:.1f}%)'
        },

        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'black',
                        // textShadow: '0px 1px 2px black'
                    }
                },
                startAngle: -90,
                endAngle: 270,
                center: ['50%', '50%']
            }
        }
	},

	donutChartData : Ember.computed("content.units.@each.approved", function() {

		var data = [],
			approved = 0,
			unapproved = 0;

		this.get("content.units").forEach(function(unit) {
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

	chartDataCurrentDtm : Ember.computed("content.units.[]", function() {
		var data = [0,0,0,0,0,0,0,0,0],
			self = this,
			dtm,
			invDtm;

		this.get("content.units").forEach(function(unit) {
			dtm = unit.get("currentDiscountToMarket") * 100;
			invDtm = -1 * dtm;
			if( invDtm >= self.get("striation3") ) {
				data[0] += 1;
			} else if( invDtm >= self.get("striation2") && invDtm < self.get("striation3") ) {
				data[1] += 1;
			} else if( invDtm >= self.get("striation1") && invDtm < self.get("striation2") ) {
				data[2] += 1;
			} else if( invDtm > self.get("striation0") && invDtm < self.get("striation1") ) {
				data[3] += 1;
			} else if( dtm === self.get("striation0") ) {
				data[4] += 1;
			} else if( dtm > self.get("striation0") && dtm < self.get("striation1") ) {
				data[5] += 1;
			} else if( dtm >= self.get("striation1") && dtm < self.get("striation2") ) {
				data[6] += 1;
			} else if( dtm >= self.get("striation2") && dtm < self.get("striation3") ) {
				data[7] += 1;
			} else if( dtm >= self.get("striation3") ) {
				data[8] += 1;
			}
		});

		return data;
	}),

	chartDataNewDtm : Ember.computed("content.units.@each.finalRecRent", function() {
		var data = [0,0,0,0,0,0,0,0,0],
			self = this,
			dtm,
			invDtm;

		this.get("content.units").forEach(function(unit) {
			dtm = unit.get("finalDiscountToMarket") * 100;
			invDtm = -1 * dtm;
			if( invDtm >= self.get("striation3") ) {
				data[0] += 1;
			} else if( invDtm >= self.get("striation2") && invDtm < self.get("striation3") ) {
				data[1] += 1;
			} else if( invDtm >= self.get("striation1") && invDtm < self.get("striation2") ) {
				data[2] += 1;
			} else if( invDtm > self.get("striation0") && invDtm < self.get("striation1") ) {
				data[3] += 1;
			} else if( dtm === self.get("striation0") ) {
				data[4] += 1;
			} else if( dtm > self.get("striation0") && dtm < self.get("striation1") ) {
				data[5] += 1;
			} else if( dtm >= self.get("striation1") && dtm < self.get("striation2") ) {
				data[6] += 1;
			} else if( dtm >= self.get("striation2") && dtm < self.get("striation3") ) {
				data[7] += 1;
			} else if( dtm >= self.get("striation3") ) {
				data[8] += 1;
			}
		});

		return data;
	}),

	chartDataDetailAvgInc : Ember.computed("content.units.@each.finalRecRent", function() {
		var data = [],
			arr = [],
			self = this,
			inc, dtm, invDtm;

		for( var i = 0; i < 9; i++ ) {
			data[i] = { count : 0, sum : 0 };
		}

		this.get("content.units").forEach(function(unit) {
			dtm = unit.get("currentDiscountToMarket") * 100;
			inc = unit.get("userIncreasePct");
			invDtm = -1 * dtm;
			if( invDtm >= self.get("striation3") ) {
				data[0].count += 1;
				data[0].sum += inc;
			} else if( invDtm >= self.get("striation2") && invDtm < self.get("striation3") ) {
				data[1].count += 1;
				data[1].sum += inc;
			} else if( invDtm >= self.get("striation1") && invDtm < self.get("striation2") ) {
				data[2].count += 1;
				data[2].sum += inc;
			} else if( invDtm > self.get("striation0") && invDtm < self.get("striation1") ) {
				data[3].count += 1;
				data[3].sum += inc;
			} else if( dtm === self.get("striation0") ) {
				data[4].count += 1;
				data[4].sum += inc;
			} else if( dtm > self.get("striation0") && dtm < self.get("striation1") ) {
				data[5].count += 1;
				data[5].sum += inc;
			} else if( dtm >= self.get("striation1") && dtm < self.get("striation2") ) {
				data[6].count += 1;
				data[6].sum += inc;
			} else if( dtm >= self.get("striation2") && dtm < self.get("striation3") ) {
				data[7].count += 1;
				data[7].sum += inc;
			} else if( dtm >= self.get("striation3") ) {
				data[8].count += 1;
				data[8].sum += inc;
			}
		});

		for( var k = 0; k < data.length; k++ ) {
			arr[k] = Number(((data[k].sum / data[k].count) * 100).toFixed(1)) || 0;
		}

		return arr;
	}),

	detailChartOptions: {
		chart: {
			// type: 'column',
			zoomType: 'none', // 'x', 'y', 'xy' or 'none'
			style : {
				fontFamily : "Avenir"
			},
			height: 300
		},
		title: {
			text: ''
		},
		xAxis: [{
			categories: ['-10+', '-5-10', '-5-2', '-2-0', '0', '0-2', '2-5', '5-10', '10+'],
			crosshair : true,
			labels : {
				align : "center",
				autoRotation : 0
			}
		}],
		yAxis: [
			{	// Primary Axis
				title: {
					text: 'Unit Count'
				}
    		},
    		{	// Secondary Axis
    			title : {
    				text : "Increase %"
    			},
				labels : {
					format : "{value}%"
				},
    			opposite : true
    		}
    	],
    	tooltip : {
    		shared : true,
    		backgroundColor : "rgba(255,255,255,1)",
    	},
    	legend: {
			layout: 'horizontal',
			align: 'center',
			x: 0,
			verticalAlign: 'top',
			y: 0,
			floating: false,
        }
  	},

	detailChartData : Ember.computed("content.units.@each.finalRecRent", function(){
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
