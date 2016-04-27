import Ember from 'ember';
import computedFilterByQuery from 'ember-cli-filter-by-query';

export default Ember.Controller.extend({

	dateFormat : "MMM D, YYYY",
	communityController : Ember.inject.controller("lro.pricingLeasing.community"),
	community : Ember.computed.reads("communityController.model"),

	pricingLeasingController : Ember.inject.controller("lro.pricingLeasing"),
	communities : Ember.computed.reads("pricingLeasingController.model"),

	currentDate : Date(),
	startDate: moment().subtract(2, "years").toDate(),
	endDate : moment().toDate(),
	searchText : null,

	priceDate : Ember.computed('currentDate', function() {
		return Ember.String.htmlSafe( this.get('currentDate').format("YYYY-MM-DD") );
	}),

	// queryParams : ["priceDate"],

	minPrice : Ember.computed('content.[]', function() {
    	return this.get("content").reduce(function( prevValue, unit ) {
            return Math.min(prevValue, unit.get("effectiveRent"));
    	}, 1000000);
  	}),

  	maxPrice : Ember.computed('content.[]', function() {
    	return this.get("content").reduce(function( prevValue, unit ) {
            return Math.max(prevValue, unit.get("effectiveRent"));
    	}, 0);
  	}),

  	filteredUnitTypes : Ember.ArrayProxy.create({ content : Ember.A([]) }),

  	summarizedContent : Ember.computed('content.[]', function() {

		var content = Ember.ArrayProxy.create({ content : Ember.A([]) });
		// return content;
		this.get("content").forEach( function(itm) {
			var ut = itm.get("unitType");

			var utObj = content.findBy("unitType", ut);

			if( utObj ) {
				utObj.units.push(itm);
				utObj.count = utObj.units.length;
				utObj.oneUnit = false;
				utObj.minRent = utObj.units.reduce(function( prevValue, unit ) {
					return Math.min(prevValue, unit.get("effectiveRent"));
				}, 1000000);
				utObj.maxRent = utObj.units.reduce(function( prevValue, unit ) {
					return Math.max(prevValue, unit.get("effectiveRent"));
				}, 0);
			} else {
				var newObj = Ember.Object.create({
					unitType : ut,
					unitCategory : itm.get("unitCategory"),
					minRent : itm.get("effectiveRent"),
					maxRent : itm.get("effectiveRent"),
					count : 1,
					active : false,
					oneUnit : true,
					units : [itm]
				});
				content.pushObject(newObj);
			}
		});

		return content;
    }),

  	filteredContent : Ember.computed('content.[]', 'filteredUnitTypes.[]', 'userPrice', "pmsUnitTypeFilter", "statusFilter", function() {

  		return this.get("content").filter(function(unit, i) {
			var f1 = true, // unitType
				f2 = true, // pmsUnitType
				f3 = true, // status
				f4 = true; // price

				if( this.get("filteredUnitTypes.length") !== 0 ) {
					if( !this.get("filteredUnitTypes").contains(unit.get("unitType")) ) {
						f1 = false;
					}
				}

				if( this.get("pmsUnitTypeFilter") ) {
					if( unit.get("pmsUnitType") !== this.get("pmsUnitTypeFilter.text") ) {
						f2 = false;
					}
				}

				if( this.get("statusFilter") ) {
					if( unit.get("status") !== this.get("statusFilter.text") ) {
						f3 = false;
					}
				}

				if( unit.get("effectiveRent") > this.get("userPrice") ) {
					f4 = false;
				}
				console.log(f1, f2, f3, f4);
				return (f1 && f2 && f3 && f4);
		}, this);
  	}),

  	filteredSearchedContent : computedFilterByQuery('filteredContent', ['unitNumber','status','unitType','unitCategory','pmsUnitType','amenities'], 'searchText'),

  	groupedContent : Ember.computed('filteredSearchedContent.[]', function() {

		var content = Ember.ArrayProxy.create({ content : Ember.A([]) });
		// return content;

		this.get("filteredSearchedContent").forEach( function(itm) {
			var ut = itm.get("unitType");

			var utObj = content.findBy("unitType", ut);

			if( utObj ) {
				utObj.units.push(itm);
				utObj.count = utObj.units.length;
				utObj.minRent = utObj.units.reduce(function( prevValue, unit ) {
					return Math.min(prevValue, unit.get("effectiveRent"));
				}, 1000000);
				utObj.maxRent = utObj.units.reduce(function( prevValue, unit ) {
					return Math.max(prevValue, unit.get("effectiveRent"));
				}, 0);
			} else {
				var newObj = Ember.Object.create({
					unitType : ut,
					unitCategory : itm.get("unitCategory"),
					minRent : itm.get("effectiveRent"),
					maxRent : itm.get("effectiveRent"),
					units : [itm]
				});
				content.pushObject(newObj);
			}
		});
		return content;
  	}),

  	showColumns : [
		{	"name" : "Move-out",
			"show" : true,
			"key" : "moveout"
      	},
		{	"name" : "Prior Rent",
			"show" : true,
			"key" : "priorRent"
		},
		{	"name" : "Total Concession",
			"show" : false,
			"key" : "totalConcession"
		},
		{	"name" : "Amenities",
			"show" : false,
			"key" : "amenities"
		},
		{	"name" : "Amenity Amount",
			"show" : true,
			"key" : "amenityAmount"
		},
		{	"name" : "Base Rent",
			"show" : false,
			"key" : "baseRent"
		},
		{	"name" : "PMS Unit Type",
			"show" : true,
			"key" : "pmsUnitType"
		},
		{	"name" : "Offset",
			"show" : true,
			"key" : "offset"
		},
		{	"name" : "Square Feet",
			"show" : true,
			"key" : "sf"
		}
	],

    hbsShowColumns : Ember.computed('showColumns.@each.show', function() {
		var obj = {};

		this.get("showColumns").forEach(function(itm) {
			obj[itm.key] = {
				"name": itm.name,
				"show": itm.show
			};
		});
		return obj;
    }),

    contentObserver : Ember.observer("content.[]", function() {

    	Ember.run.once(this, function() {

			var cols = ["unitType", "pmsUnitType", "status"],
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

			this.get("content").forEach(function(unit) {
				filters.forEach(function(filter) {
					var val = unit.get(filter.get("key"));
					var b = filter.get("arr").findBy("text", val);
					if( !b ) {
						var newObj = Ember.Object.create({
							id : val,
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

    })
});
