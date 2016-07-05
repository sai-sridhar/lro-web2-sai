import Ember from 'ember';
import RoundingMixin from 'zion/mixins/rounding';

export default Ember.Controller.extend(RoundingMixin, {

	communityView : null,
	unitView : null,
	newDtmMin : 0,
	newDtmMax : 0,
	currentDtmMin : 0,
	currentDtmMax : 0,
	unitSortBy : ["communityName:asc"],
	communitySortBy : ["communityFullName:asc"],

	detailView : null,
	showDetailFilters : false,
	queryParams : ["showDetailFilters", "detailView"],

	detailViewObserver : Ember.observer("detailView", function() {
		if( this.get("detailView") === "community" ) {
			this.set("unitView", false);
			this.set("communityView", true);
		} else if( this.get("detailView") === "unit" ) {
			this.set("unitView", true);
			this.set("communityView", false);
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

	hbsUnitContent : Ember.computed.sort("filteredUnitContent", "unitSortBy"),

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
				if( unit.get("communityName") !== this.get("communityFilter.text") ) {
					f10 = false;
				}
			}
		 	// console.log(f1,f2,f3,f4,f5,f6,f7,f8,f9,f10, unit.get("id"));
			return (f1 && f2 && f3 && f4 && f5 && f6 && f7 && f8 && f9 && f10);
		}, this);
	}),

	unitFiltersApplied : Ember.computed("filteredUnitContent.length", function() {
		if( this.get("filteredUnitContent.length") === this.get("units.length") ) {
			return false;
		} else {
			return true;
		}
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

	communityFiltersApplied : Ember.computed("filteredCommunityContent.length", function() {
		if( this.get("filteredCommunityContent.length") === this.get("model.communities.length") ) {
			return false;
		} else {
			return true;
		}
	}),

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
  	}
});
