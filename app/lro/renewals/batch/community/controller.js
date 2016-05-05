import Ember from 'ember';
import RoundingMixin from 'zion/mixins/rounding';
// import defaultTheme from '../themes/default-theme';

export default Ember.Controller.extend(RoundingMixin, {
	unitTypeView : null,
	unitView : null,

	detailView : null,
	showDetailFilters : false,
	showParams : false,
	showTerms : false,
	queryParams : ["showDetailFilters", "detailView", "showParams", "showTerms"],

	detailViewObserver : Ember.observer("detailView", function() {
		if( this.get("detailView") === "unitType" ) {
			this.set("unitView", false);
			this.set("unitTypeView", true);
		} else if( this.get("detailView") === "unit" ) {
			this.set("unitView", true);
			this.set("unitTypeView", false);
		}
	}),

	unitTypeContent : Ember.computed("model.units.@each.finalRecRent", function() {
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
			} else {
				var newObj = Ember.Object.create({
					unitType : unitType,
					expirationCount : 1,
					totalRecRent : unit.get("finalRecRent"),
					totalRecLeaseTerm : unit.get("recLeaseTerm"),
					totalCurrentRent : unit.get("currentRent"),
					totalCurrentLeaseTerm : unit.get("currentLeaseTerm"),
					totalIncrease : unit.get("userIncreasePct"),
					minIncrease : unit.get("userIncreasePct"),
					maxIncrease : unit.get("userIncreasePct"),
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

			ut.minIncrease = ut.units.reduce(function( prevValue, unit ) {
				return Math.min(prevValue, unit.get("userIncreasePct"));
			}, 10000);

			ut.maxIncrease = ut.units.reduce(function( prevValue, unit ) {
				return Math.max(prevValue, unit.get("userIncreasePct"));
			}, -10000);
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
  	},

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

  	filteredUnitContent : Ember.computed("increaseMin", "increaseMax", "newDtmMin", "newDtmMax", "currentDtmMin", "currentDtmMax", "bedsFilter", "bathsFilter", "unitTypeFilter", "pmsUnitTypeFilter", "overrideUnitFilter", "unapprovedUnitFilter", "model.units.@each.userIncreasePct", "model.units.@each.approved", function() {

		// return this.get("model.units");

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

		return this.get("model.units").filter(function(unit, i) {
			var f1 = true, // increase pct
				f2 = true, // beds
				f3 = true, // baths
				f4 = true, // unit type
				f5 = true, // pms unit type
				f6 = true, // overrides
				f7 = true, // current discount to market
				f8 = true, // new discount to market
				f9 = true, // unapproved units


				inc = this.round(unit.get("userIncreasePct"), 4);
				cDtm = this.round(unit.get("currentDiscountToMarket"), 4);
				nDtm = this.round(unit.get("finalDiscountToMarket"), 4);

			if( !(inc >= incMin && inc <= incMax) ) {
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

});
