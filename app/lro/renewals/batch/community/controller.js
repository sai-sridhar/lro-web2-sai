import Ember from 'ember';
// import defaultTheme from '../themes/default-theme';

export default Ember.Controller.extend({
	showParams : false,
	showTerms : false,
	unitTypeView : false,
	unitView : true,

	unitTypes : Ember.computed("content.units.@each.finalRecRent", function() {
		var content = Ember.ArrayProxy.create({ content : Ember.A([]) });

		this.get("content.units").forEach( function(unit) {
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
		});

		return content;
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
