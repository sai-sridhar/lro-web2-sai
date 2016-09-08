import Ember from 'ember';
import RoundingMixin from 'zion/mixins/rounding';
import AggregationMixin from 'zion/mixins/aggregation';

export default Ember.Controller.extend(RoundingMixin, AggregationMixin, {

	communityView : null,
	unitView : null,
	summaryView : null,
	newDtmMin : 0,
	newDtmMax : 0,
	currentDtmMin : 0,
	currentDtmMax : 0,
	communitySortBy : ["communityFullName:asc"],

	detailView : null,
	showDetailFilters : false,
	queryParams : ["showDetailFilters", "detailView"],

	filtersApplied : Ember.computed("filteredCommunityContent.length", "filteredUnitContent.length", function() {
		if( (this.get("filteredCommunityContent.length") === this.get("model.communities.length")) && (this.get("filteredUnitContent.length") === this.get("units.length")) ) {
			return false;
		} else {
			return true;
		}
	}),

	detailViewObserver : Ember.observer("detailView", function() {
		if( this.get("detailView") === "community" ) {
			this.setProperties({
				"communityView" : true,
				"unitView" : false,
				"summaryView" : false
			});
		} else if( this.get("detailView") === "unit" ) {
			this.setProperties({
				"unitView" : true,
				"communityView" : false,
				"summaryView" : false
			});
		} else if( this.get("detailView") === "summary" ) {
			this.setProperties({
				"summaryView" : true,
				"unitView" : false,
				"communityView" : false
			});
		}
	}),

	units : Ember.computed("model.communities.@each.units", function() {
		var units = Ember.ArrayProxy.create({ content : Ember.A([])});
		this.get("model.communities").forEach(function(comm) {
			comm.get("units").forEach(function(unit) {
				units.pushObject(unit);
			});
		});
		return units;
	}),

	filteredUnitContent : Ember.computed("minIncFilter", "maxIncFilter", "minNewDtmFilter", "maxNewDtmFilter", "minCurrentDtmFilter", "maxCurrentDtmFilter", "communityFilter", "bedsFilter", "bathsFilter", "unitTypeFilter", "pmsUnitTypeFilter", "overrideUnitFilter", "unapprovedUnitFilter", "units.@each.userIncreasePct", "units.@each.approved", function() {

		var incMin = this.round(this.get("minIncFilter") / 100, 4),
			incMax = this.round(this.get("maxIncFilter") / 100, 4),
			inc,
			cDtmMin = this.round(this.get("minCurrentDtmFilter") / 100, 4),
			cDtmMax = this.round(this.get("maxCurrentDtmFilter") / 100, 4),
			cDtm,
			nDtmMin = this.round(this.get("minNewDtmFilter") / 100, 4),
			nDtmMax = this.round(this.get("maxNewDtmFilter") / 100, 4),
			nDtm;

		return this.get("units").filter(function(unit) {
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

			if( isNaN(incMin) || isNaN(incMax) ) {
				f1 = true;
			} else if( incMin === 0 && incMax === 0 ) {
				f1 = true;
			} else if ( !(inc >= incMin && inc <= incMax) ) {
				f1 = false;
			}

			if( this.get("bedsFilter") ) {
				if( this.get("bedsFilter.text") !== unit.get("beds") ) {
					f2 = false;
				}
			}

			if( this.get("bathsFilter") ) {
				if( this.get("bathsFilter.text") !== unit.get("baths") ) {
					f3 = false;
				}
			}

			if( this.get("unitTypeFilter") ) {
				if( this.get("unitTypeFilter.text") !== unit.get("unitType") ) {
					f4 = false;
				}
			}

			if( this.get("pmsUnitTypeFilter") ) {
				if( this.get("pmsUnitTypeFilter.text") !== unit.get("pmsUnitType") ) {
					f5 = false;
				}
			}

			if( this.get("overrideUnitFilter") ) {
				if( !unit.get("userOverrideMode") ) {
					f6 = false;
				}
			}

			if( isNaN(cDtmMin) || isNaN(cDtmMax) ) {
				f7 = true;
			} else if( cDtmMin === 0 && cDtmMax === 0 ) {
				f7 = true;
			} else if( !(cDtm >= cDtmMin && cDtm <= cDtmMax) ) {
			 	f7 = false;
			}

			if( isNaN(nDtmMin) || isNaN(nDtmMax) ) {
				f8 = true;
			} else if( nDtmMin === 0 && nDtmMax === 0 ) {
				f8 = true;
			} else if( !(nDtm >= nDtmMin && nDtm <= nDtmMax) ) {
			 	f8 = false;
			}

			if( this.get("unapprovedUnitFilter") ) {
				if( unit.get("approved") ) {
					f9 = false;
				}
			}

			if( this.get("communityFilter") ) {
				if( unit.get("communityFullName") !== this.get("communityFilter.text") ) {
					f10 = false;
				}
			}
		 	// console.log(f1,f2,f3,f4,f5,f6,f7,f8,f9,f10, unit.get("id"));
			return (f1 && f2 && f3 && f4 && f5 && f6 && f7 && f8 && f9 && f10);
		}, this);
	}),

	avgIncreaseObserver : Ember.observer("model.communities.@each.avgIncrease", function() {
		// find the min
		var min = this.get("model.communities").reduce(function(prev, itm) {
			return (prev < itm.get("avgIncrease") ? prev : itm.get('avgIncrease'));
		}, this.get("model.communities.firstObject.avgIncrease"));

		// find the max
		var max = this.get("model.communities").reduce(function(prev, itm) {
			return (prev > itm.get("avgIncrease") ? prev : itm.get('avgIncrease'));
		}, this.get("model.communities.firstObject.avgIncrease"));

		this.set("avgIncreaseMin", this.round(min * 100, 1));
		this.set("avgIncreaseMax", this.round(max * 100, 1));
	}),

	avgCurrentDtmObserver : Ember.observer("model.communities.@each.avgCurrentDiscountToMarket", function() {
		// find the min
		var min = this.get("model.communities").reduce(function(prev, itm) {
			return (prev < itm.get("avgCurrentDiscountToMarket") ? prev : itm.get('avgCurrentDiscountToMarket'));
		}, this.get("model.communities.firstObject.avgCurrentDiscountToMarket"));

		// find the max
		var max = this.get("model.communities").reduce(function(prev, itm) {
			return (prev > itm.get("avgCurrentDiscountToMarket") ? prev : itm.get('avgCurrentDiscountToMarket'));
		}, this.get("model.communities.firstObject.avgCurrentDiscountToMarket"));

		this.set("avgCurrentDtmMin", this.round(min * 100, 1));
		this.set("avgCurrentDtmMax", this.round(max * 100, 1));
	}),

	avgNewDtmObserver : Ember.observer("model.communities.@each.avgNewDiscountToMarket", function() {
		// find the min
		var min = this.get("model.communities").reduce(function(prev, itm) {
			return (prev < itm.get("avgNewDiscountToMarket") ? prev : itm.get('avgNewDiscountToMarket'));
		}, this.get("model.communities.firstObject.avgNewDiscountToMarket"));

		// find the max
		var max = this.get("model.communities").reduce(function(prev, itm) {
			return (prev > itm.get("avgNewDiscountToMarket") ? prev : itm.get('avgNewDiscountToMarket'));
		}, this.get("model.communities.firstObject.avgNewDiscountToMarket"));

		this.set("avgNewDtmMin", this.round(min * 100, 1));
		this.set("avgNewDtmMax", this.round(max * 100, 1));
	}),

	filteredCommunityContent : Ember.computed("minAvgIncFilter", "maxAvgIncFilter", "minAvgCurrentDtmFilter", "maxAvgCurrentDtmFilter", "minAvgNewDtmFilter", "maxAvgNewDtmFilter", "overrideCommunityFilter", "unapprovedCommunityFilter", "communityFilter", "model.communities.@each.avgIncrease", function() {
		var avgIncMin = this.round(this.get("minAvgIncFilter") / 100, 4),
			avgIncMax = this.round(this.get("maxAvgIncFilter") / 100, 4),
			avgInc,
			cDtmMin = this.round(this.get("minAvgCurrentDtmFilter") / 100, 4),
			cDtmMax = this.round(this.get("maxAvgCurrentDtmFilter") / 100, 4),
			cDtm,
			nDtmMin = this.round(this.get("minAvgNewDtmFilter") / 100, 4),
			nDtmMax = this.round(this.get("maxAvgNewDtmFilter") / 100, 4),
			nDtm;


		return this.get("model.communities").filter(function(comm) {
			var f1 = true, // avg increase pct
				f2 = true, // communities with unapproved units
				f3 = true, // communities with overrides
				f4 = true, // avg current dtm
				f5 = true, // avg new dtm
				f6 = true; // community

			avgInc = this.round(comm.get("avgIncrease"), 4);
			cDtm = this.round(comm.get("avgCurrentDiscountToMarket"), 4);
			nDtm = this.round(comm.get("avgNewDiscountToMarket"), 4);

			if( isNaN(avgIncMin) || isNaN(avgIncMax) ) {
				f1 = true;
			} else if( avgIncMin === 0 && avgIncMax === 0 ) {
				f1 = true;
			} else if( !(avgInc >= avgIncMin && avgInc <= avgIncMax) ) {
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

			if( isNaN(cDtmMin) || isNaN(cDtmMax) ) {
				f4 = true;
			} else if( cDtmMin === 0 && cDtmMax === 0 ) {
				f4 = true;
			} else if( !(cDtm >= cDtmMin && cDtm <= cDtmMax) ) {
			 	f4 = false;
			}

			if( isNaN(nDtmMin) || isNaN(nDtmMax) ) {
				f5 = true;
			} else if( nDtmMin === 0 && nDtmMax === 0 ) {
				f5 = true;
			} else if( !(nDtm >= nDtmMin && nDtm <= nDtmMax) ) {
			 	f5 = false;
			}

			if( this.get("communityFilter") ) {
				if( comm.get("communityFullName") !== this.get("communityFilter.text") ) {
					f6 = false;
				}
			}

			return (f1 && f2 && f3 && f4 && f5 && f6);
		}, this);
	}),

	hbsCommunityContent : Ember.computed.sort("filteredCommunityContent", "communitySortBy"),

	filteredSummaryContent : Ember.computed("units.@each.beds", "bedsFilter", "bathsFilter", "unitTypeFilter", "pmsUnitTypeFilter", function() {
		return this.get("units").filter(function(unit) {
			var f1 = true, // beds
				f2 = true, // baths
				f3 = true, // unit type
				f4 = true; // pms unit type

			if( this.get("bedsFilter") ) {
				if( this.get("bedsFilter.text") !== unit.get("beds") ) {
					f1 = false;
				}
			}

			if( this.get("bathsFilter") ) {
				if( this.get("bathsFilter.text") !== unit.get("baths") ) {
					f2 = false;
				}
			}

			if( this.get("unitTypeFilter") ) {
				if( this.get("unitTypeFilter.text") !== unit.get("unitType") ) {
					f3 = false;
				}
			}

			if( this.get("pmsUnitTypeFilter") ) {
				if( this.get("pmsUnitTypeFilter.text") !== unit.get("pmsUnitType") ) {
					f4 = false;
				}
			}

			return (f1 && f2 && f3 && f4);
		}, this);
	}),

	filtTotalIncrease : Ember.computed("filteredSummaryContent", function() {
		return this.calcSum(this.get("filteredSummaryContent"), "userIncreasePct");
	}),
	filtAvgIncrease : Ember.computed("filtTotalIncrease", function() {
		return this.calcAvg(this.get("filtTotalIncrease"), this.get("filteredSummaryContent.length"));
	}),
	filtTotalCurrentDtm : Ember.computed("filteredSummaryContent", function() {
		return this.calcSum(this.get("filteredSummaryContent"), "currentDiscountToMarket");
	}),
	filtAvgCurrentDtm : Ember.computed("filtTotalCurrentDtm", function() {
		return this.calcAvg(this.get("filtTotalCurrentDtm"), this.get("filteredSummaryContent.length"));
	}),
	filtTotalNewDtm : Ember.computed("filteredSummaryContent", function() {
		return this.calcSum(this.get("filteredSummaryContent"), "newDiscountToMarket");
	}),
	filtAvgNewDtm : Ember.computed("filtTotalNewDtm", function() {
		return this.calcAvg(this.get("filtTotalNewDtm"), this.get("filteredSummaryContent.length"));
	}),
	filtMinIncrease : Ember.computed("filteredSummaryContent", function() {
		return this.getMin(this.get("filteredSummaryContent"), 'userIncreasePct');
	}),
	filtMaxIncrease : Ember.computed("filteredSummaryContent", function() {
		return this.getMax(this.get("filteredSummaryContent"), 'userIncreasePct');
	}),
	filtMinCurrentDtm : Ember.computed("filteredSummaryContent", function() {
		return this.getMin(this.get("filteredSummaryContent"), 'currentDiscountToMarket');
	}),
	filtMaxCurrentDtm : Ember.computed("filteredSummaryContent", function() {
		return this.getMax(this.get("filteredSummaryContent"), 'currentDiscountToMarket');
	}),
	filtMinNewDtm : Ember.computed("filteredSummaryContent", function() {
		return this.getMin(this.get("filteredSummaryContent"), 'finalDiscountToMarket');
	}),
	filtMaxNewDtm : Ember.computed("filteredSummaryContent", function() {
		return this.getMax(this.get("filteredSummaryContent"), 'finalDiscountToMarket');
	}),

	// Chart Configs
	striation0 : 0,
	striation1 : 2,
	striation2 : 4,
	striation3 : 8,

	chartMode: null,

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
			text: 'Current Rent Relative to Market'
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
			verticalAlign: 'bottom',
			y: 0,
			floating: false,
        }
  	},
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
	detailChartStriations : Ember.computed("striation1", "striation2", "striation3", function() {
		let arr = [],
			s1 = this.get("striation1"),
			s2 = this.get("striation2"),
			s3 = this.get("striation3");
		arr.push("(" + s3 + "%)+");
		arr.push("(" + s2 + "%) - (" + s3 + "%)");
		arr.push("(" + s1 + "%) - (" + s2 + "%)");
		arr.push( "0 - (" + s1 + "%)");
		arr.push("At Market");
		arr.push( "0 - " + s1 + "%");
		arr.push(s1 + "% - " + s2 + "%");
		arr.push(s2 + "% - " + s3 + "%");
		arr.push(s3 + "%+");

		return arr;
	}),
	detailChartOptions : Ember.computed("detailChartStriations", function() {
		let categories = this.get("detailChartStriations");
		let obj = {
			chart: {
				// type: 'column',
				zoomType: 'none', // 'x', 'y', 'xy' or 'none'
				style : {
					fontFamily : "Avenir"
				},
				height: 300
			},
			title: {
				text: 'Current Rent and Offer Rent by % Above/Below Market'
			},
			xAxis: [{
				categories: categories,
				crosshair : true,
				labels : {
					align : "center",
					autoRotation : 0
				}
			}],
			yAxis: [
				{	// Primary Axis
					title: {
						text: 'Expiration Count'
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
				verticalAlign: 'bottom',
				y: 0,
				floating: false,
	        }
	  	};
		return obj;
	}),

	// Chart Data
	chartDataDtm : Ember.computed("filteredSummaryContent.@each.currentDiscountToMarket", function() {
		let belowMkt = 0,
			atMkt = 0,
			aboveMkt = 0;

		this.get("filteredSummaryContent").forEach(function(unit) {
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

	chartDataAvgInc : Ember.computed("filteredSummaryContent.@each.finalRecRent", function() {
		let belowMktSum = 0,
			belowMktCount = 0,
			atMktSum = 0,
			atMktCount = 0,
			aboveMktSum = 0,
			aboveMktCount = 0,
			belowMktAvg, atMktAvg, aboveMktAvg, inc, dtm;

		this.get("filteredSummaryContent").forEach(function(unit) {
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

	chartData : Ember.computed("filteredSummaryContent.@each.finalRecRent", function() {
		var content = [];

		// The Unit counts by Below, At, Above Market Series
		var counts = {
			name : "Current Rent",
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

	donutChartData : Ember.computed("filteredSummaryContent.@each.approved", function() {

		var data = [],
			approved = 0,
			unapproved = 0;

		this.get("filteredSummaryContent").forEach(function(unit) {
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

	chartDataCurrentDtm : Ember.computed("filteredSummaryContent.@each.currentDiscountToMarket", "striation0", "striation1", "striation2", "striation3", function() {
		var data = [0,0,0,0,0,0,0,0,0],
			dtm,
			invDtm;

		this.get("filteredSummaryContent").forEach(function(unit) {
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

	chartDataNewDtm : Ember.computed("filteredSummaryContent.@each.finalRecRent", "striation0", "striation1", "striation2", "striation3", function() {
		var data = [0,0,0,0,0,0,0,0,0],
			dtm,
			invDtm;

		this.get("filteredSummaryContent").forEach(function(unit) {
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

	chartDataDetailAvgInc : Ember.computed("filteredSummaryContent.@each.finalRecRent", "striation0", "striation1", "striation2", "striation3", function() {
		var data = [],
			arr = [],
			inc, dtm, invDtm;

		for( var i = 0; i < 9; i++ ) {
			data[i] = { count : 0, sum : 0 };
		}

		this.get("filteredSummaryContent").forEach(function(unit) {
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

	detailChartData : Ember.computed("filteredSummaryContent.@each.finalRecRent", "chartDataCurrentDtm", "chartDataNewDtm", "chartDataDetailAvgInc", function(){
		var content = [];

		// The Unit counts by Below, At, Above Market Series
		var currentCounts = {
			name : "Current Rent",
			type : "column",
			data : this.get("chartDataCurrentDtm")
		};

		var newCounts = {
			name : "Offer Rent",
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
