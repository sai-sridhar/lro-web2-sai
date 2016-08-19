import Ember from 'ember';
import RoundingMixin from 'zion/mixins/rounding';
// import defaultTheme from '../themes/default-theme';

export default Ember.Controller.extend(RoundingMixin, {
	unitTypeView : null,
	unitView : null,
	summaryView : null,
	unitSortBy : ["renewalDate:asc"],
	unitTypeSortBy : ["unitType:asc"],

	detailView : null,
	showDetailFilters : false,
	queryParams : ["showDetailFilters", "detailView"],

	detailViewObserver : Ember.observer("detailView", function() {
		if( this.get("detailView") === "unitType" ) {
			this.setProperties({
				"unitTypeView" : true,
				"unitView" : false,
				"summaryView" : false
			});
		} else if( this.get("detailView") === "unit" ) {
			this.setProperties({
				"unitView" : true,
				"unitTypeView" : false,
				"summaryView" : false
			});
		} else if( this.get("detailView") === "summary" ) {
			this.setProperties({
				"summaryView" : true,
				"unitView" : false,
				"unitTypeView" : false
			});
		}
	}),

	unitTypeContent : Ember.computed("model.units.@each.finalRecRent", "model.units.@each.approved", function() {
		var content = Ember.ArrayProxy.create({ content : Ember.A([]) });

		this.get("model.units").forEach( function(unit) {
			var unitType = unit.get("unitType");

			var utObj = content.findBy("unitType", unitType);

			if( utObj ) {
				utObj.units.push(unit);
				utObj.expirationCount = utObj.units.length;
				utObj.totalRecRent += unit.get("finalRecRent");
				utObj.totalRecLeaseTerm += unit.get("recLeaseTerm");
				utObj.totalCurrentRent += unit.get("currentRent");
				utObj.totalCurrentLeaseTerm += unit.get("currentLeaseTerm");
				utObj.totalIncrease += unit.get("userIncreasePct");
				utObj.totalCurrentDtm += unit.get("currentDiscountToMarket");
				utObj.totalNewDtm += unit.get("newDiscountToMarket");
				utObj.approvals += (unit.get("approved") ? 1 : 0);
				utObj.overrideCount += (unit.get("userOverrideMode") ? 1 : 0);
			} else {
				var newObj = Ember.Object.create({
					id : unitType,
					unitType : unitType,
					expirationCount : 1,
					totalRecRent : unit.get("finalRecRent"),
					totalRecLeaseTerm : unit.get("recLeaseTerm"),
					totalCurrentRent : unit.get("currentRent"),
					totalCurrentLeaseTerm : unit.get("currentLeaseTerm"),
					totalIncrease : unit.get("userIncreasePct"),
					minIncrease : unit.get("userIncreasePct"),
					maxIncrease : unit.get("userIncreasePct"),
					totalCurrentDtm : unit.get("currentDiscountToMarket"),
					minCurrentDtm : unit.get("currentDiscountToMarket"),
					maxCurrentDtm : unit.get("currentDiscountToMarket"),
					totalNewDtm : unit.get("newDiscountToMarket"),
					minNewDtm : unit.get("newDiscountToMarket"),
					maxNewDtm : unit.get("newDiscountToMarket"),
					approvals : (unit.get("approved") ? 1 : 0),
					overrideCount : (unit.get("userOverrideMode") ? 1 : 0),
					showDetail : false,
					units : [unit]
				});
				content.pushObject(newObj);
			}
		});

		// Loop through the content to set all the averages and min max increase
		content.forEach(function(ut) {
			ut.avgRecRent = ut.get("totalRecRent") / ut.get("expirationCount");
			ut.avgRecLeaseTerm = ut.get("totalRecLeaseTerm") / ut.get("expirationCount");
			ut.avgCurrentRent = ut.get("totalCurrentRent") / ut.get("expirationCount");
			ut.avgCurrentLeaseTerm = ut.get("totalCurrentLeaseTerm") / ut.get("expirationCount");
			ut.avgIncrease = ut.get("totalIncrease") / ut.get("expirationCount");
			ut.avgCurrentDtm = ut.get("totalCurrentDtm") / ut.get("expirationCount");
			ut.avgNewDtm = ut.get("totalNewDtm") / ut.get("expirationCount");

			ut.minIncrease = ut.units.reduce(function( prevValue, unit ) {
				return Math.min(prevValue, unit.get("userIncreasePct"));
			}, content.get("firstObject.minIncrease"));

			ut.maxIncrease = ut.units.reduce(function( prevValue, unit ) {
				return Math.max(prevValue, unit.get("userIncreasePct"));
			}, content.get("firstObject.maxIncrease"));

			ut.minCurrentDtm = ut.units.reduce(function( prevValue, unit ) {
				return Math.min(prevValue, unit.get("currentDiscountToMarket"));
			}, content.get("firstObject.minCurrentDtm"));

			ut.maxCurrentDtm = ut.units.reduce(function( prevValue, unit ) {
				return Math.max(prevValue, unit.get("currentDiscountToMarket"));
			}, content.get("firstObject.maxCurrentDtm"));

			ut.minNewDtm = ut.units.reduce(function( prevValue, unit ) {
				return Math.min(prevValue, unit.get("newDiscountToMarket"));
			}, content.get("firstObject.minNewDtm"));

			ut.maxNewDtm = ut.units.reduce(function( prevValue, unit ) {
				return Math.max(prevValue, unit.get("newDiscountToMarket"));
			}, content.get("firstObject.maxNewDtm"));

			ut.allApproved = ( ut.get("approvals") === ut.get("expirationCount") ? true : false);
		}, this);

		return content;
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

	detailChartStriations : Ember.computed("model.striation1", "model.striation2", "model.striation3", function() {
		let arr = [],
			s1 = this.get("model.striation1"),
			s2 = this.get("model.striation2"),
			s3 = this.get("model.striation3");
		arr.push("(" + s3 + ")+");
		arr.push("(" + s2 + ") - (" + s3 + ")");
		arr.push("(" + s1 + ") - (" + s2 + ")");
		arr.push( "0 - (" + s1 + ")");
		arr.push("0");
		arr.push( "0 - " + s1);
		arr.push(s1 + " - " + s2);
		arr.push(s2 + " - " + s3);
		arr.push(s3 + "+");

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
				text: ''
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
				verticalAlign: 'top',
				y: 0,
				floating: false,
	        }
		};

		return obj;
  	}),

  	unitFilterConstruct : Ember.observer("model.unitTypes", "model.pmsUnitTypes", "model.beds", "model.baths", function() {
  		var cols = ["unitTypes", "pmsUnitTypes", "beds", "baths"];
  		for( var i = 0; i < cols.length; i++ ) {
  			var emberArr = Ember.ArrayProxy.create({ content : Ember.A([])});
  			this.get("model."+cols[i]).forEach(function(itm) {
				emberArr.pushObject(Ember.Object.create({
					id : itm,
					text : itm
				}));
			});
			this.set(cols[i], emberArr);
  		}
  	}),

	hbsUnitContent : Ember.computed.sort("filteredUnitContent", "unitSortBy"),

  	filteredUnitContent : Ember.computed("minIncFilter", "maxIncFilter", "minNewDtmFilter", "maxNewDtmFilter", "minCurrentDtmFilter", "maxCurrentDtmFilter", "bedsFilter", "bathsFilter", "unitTypeFilter", "pmsUnitTypeFilter", "overrideUnitFilter", "unapprovedUnitFilter", "model.units.@each.userIncreasePct", "model.units.@each.approved", function() {

		// return this.get("model.units");

		var incMin = this.round(this.get("minIncFilter") / 100, 4),
			incMax = this.round(this.get("maxIncFilter") / 100, 4),
			inc,
			cDtmMin = this.round(this.get("minCurrentDtmFilter") / 100, 4),
			cDtmMax = this.round(this.get("maxCurrentDtmFilter") / 100, 4),
			cDtm,
			nDtmMin = this.round(this.get("minNewDtmFilter") / 100, 4),
			nDtmMax = this.round(this.get("maxNewDtmFilter") / 100, 4),
			nDtm;

		return this.get("model.units").filter(function(unit) {
			var f1 = true, // increase pct
				f2 = true, // beds
				f3 = true, // baths
				f4 = true, // unit type
				f5 = true, // pms unit type
				f6 = true, // overrides
				f7 = true, // current discount to market
				f8 = true, // new discount to market
				f9 = true; // unapproved units

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

		 	// console.log(f1,f2,f3,f4,f5,f6,f7,f8,f9, unit.get("id"));

			return (f1 && f2 && f3 && f4 && f5 && f6 && f7 && f8 && f9);
		}, this);
	}),

	unitFiltersApplied : Ember.computed("filteredUnitContent.length", function() {
		if( this.get("filteredUnitContent.length") === this.get("model.units.length") ) {
			return false;
		} else {
			return true;
		}
	}),

	avgIncreaseObserver : Ember.observer("unitTypeContent.@each.avgIncrease", function() {
		// find the min
		var min = this.get("unitTypeContent").reduce(function(prev, itm) {
			return (prev < itm.get("avgIncrease") ? prev : itm.get('avgIncrease'));
		}, this.get("unitTypeContent.firstObject.avgIncrease"));

		// find the max
		var max = this.get("unitTypeContent").reduce(function(prev, itm) {
			return (prev > itm.get("avgIncrease") ? prev : itm.get('avgIncrease'));
		}, this.get("unitTypeContent.firstObject.avgIncrease"));

		this.set("avgIncreaseMin", this.round(min * 100, 1));
		this.set("avgIncreaseMax", this.round(max * 100, 1));
	}),

	avgCurrentDtmObserver : Ember.observer("unitTypeContent.@each.avgCurrentDtm", function() {
		// find the min
		var min = this.get("unitTypeContent").reduce(function(prev, itm) {
			return (prev < itm.get("avgCurrentDtm") ? prev : itm.get('avgCurrentDtm'));
		}, this.get("unitTypeContent.firstObject.avgCurrentDtm"));

		// find the max
		var max = this.get("unitTypeContent").reduce(function(prev, itm) {
			return (prev > itm.get("avgCurrentDtm") ? prev : itm.get('avgCurrentDtm'));
		}, this.get("unitTypeContent.firstObject.avgCurrentDtm"));

		this.set("avgCurrentDtmMin", this.round(min * 100, 1));
		this.set("avgCurrentDtmMax", this.round(max * 100, 1));
	}),

	avgNewDtmObserver : Ember.observer("unitTypeContent.@each.avgNewDtm", function() {
		// find the min
		var min = this.get("unitTypeContent").reduce(function(prev, itm) {
			return (prev < itm.get("avgNewDtm") ? prev : itm.get('avgNewDtm'));
		}, this.get("unitTypeContent.firstObject.avgNewDtm"));

		// find the max
		var max = this.get("unitTypeContent").reduce(function(prev, itm) {
			return (prev > itm.get("avgNewDtm") ? prev : itm.get('avgNewDtm'));
		}, this.get("unitTypeContent.firstObject.avgNewDtm"));

		this.set("avgNewDtmMin", this.round(min * 100, 1));
		this.set("avgNewDtmMax", this.round(max * 100, 1));
	}),

	filteredUnitTypeContent : Ember.computed("minAvgIncFilter", "maxAvgIncFilter", "minAvgCurrentDtmFilter", "maxAvgCurrentDtmFilter", "minAvgNewDtmFilter", "maxAvgNewDtmFilter", "overrideUnitTypeFilter", "unapprovedUnitTypeFilter", "unitTypeContent.@each.avgIncrease", function() {
		var avgIncMin = this.round(this.get("minAvgIncFilter") / 100, 4),
			avgIncMax = this.round(this.get("maxAvgIncFilter") / 100, 4),
			avgInc,
			cDtmMin = this.round(this.get("minAvgCurrentDtmFilter") / 100, 4),
			cDtmMax = this.round(this.get("maxAvgCurrentDtmFilter") / 100, 4),
			cDtm,
			nDtmMin = this.round(this.get("minAvgNewDtmFilter") / 100, 4),
			nDtmMax = this.round(this.get("maxAvgNewDtmFilter") / 100, 4),
			nDtm;


		return this.get("unitTypeContent").filter(function(ut) {
			var f1 = true, // avg increase pct
				f2 = true, // unit types with unapproved units
				f3 = true, // unit types with overrides
				f4 = true, // avg current dtm
				f5 = true; // avg new dtm

			avgInc = this.round(ut.get("avgIncrease"), 4);
			cDtm = this.round(ut.get("avgCurrentDtm"), 4);
			nDtm = this.round(ut.get("avgNewDtm"), 4);

			if( isNaN(avgIncMin) || isNaN(avgIncMax) ) {
				f1 = true;
			} else if( avgIncMin === 0 && avgIncMax === 0 ) {
				f1 = true;
			} else if( !(avgInc >= avgIncMin && avgInc <= avgIncMax) ) {
				f1 = false;
			}

			if( this.get("unapprovedUnitTypeFilter") ) {
				if( ut.get("allApproved") ) {
					f2 = false;
				}
			}

			if( this.get("overrideUnitTypeFilter") ) {
				if( !ut.get("overrideCount") ) {
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

			return (f1 && f2 && f3 && f4 && f5);
		}, this);
	}),

	hbsUnitTypeContent : Ember.computed.sort("filteredUnitTypeContent", "unitTypeSortBy"),

	unitTypeFiltersApplied : Ember.computed("filteredUnitTypeContent.length", function() {
		if( this.get("filteredUnitTypeContent.length") === this.get("unitTypeContent.length") ) {
			return false;
		} else {
			return true;
		}
	}),
});
