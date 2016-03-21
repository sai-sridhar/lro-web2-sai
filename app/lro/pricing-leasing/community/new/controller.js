import Ember from 'ember';

export default Ember.Controller.extend({

	communityController : Ember.inject.controller("lro.pricingLeasing.community"),
	community : Ember.computed.reads("communityController.model"),

	pricingLeasingController : Ember.inject.controller("lro.pricingLeasing"),
	communities : Ember.computed.reads("pricingLeasingController.model"),

	currentDate : moment(),
	startDate: moment().subtract(2, "years"),
	endDate : moment(),

	priceDate : Ember.computed('currentDate', function() {
		return Ember.String.htmlSafe( this.get('currentDate').format("YYYY-MM-DD") );
	}),

	queryParams : ["priceDate"],

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

  	filteredContent : Ember.computed('content.[]', 'filteredUnitTypes.[]', 'userPrice', function() {
  		var result;
  		var self = this;

		if( this.get("filteredUnitTypes.length") === 0 ) {
			result = this.get("content").filter( function(itm) {
				if( itm.get("effectiveRent") <= self.get("userPrice") ) {
					return true;
				} else {
					return false;
				}
			});
		} else {
			result = this.get("content").filter( function(itm) {
				if( self.get("filteredUnitTypes").contains(itm.get("unitType")) && itm.get("effectiveRent") <= self.get("userPrice") ) {
					return true;
				} else {
					return false;
				}
			});
		}
		return result;
  	}),

  	groupedContent : Ember.computed('filteredContent.[]', function() {

		var content = Ember.ArrayProxy.create({ content : Ember.A([]) });
		// return content;

		this.get("filteredContent").forEach( function(itm) {
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

    lroUnitTypes : Ember.computed('content.[]', function() {
    	var content = Ember.ArrayProxy.create({ content : Ember.A([]) });
		this.get("content").forEach( function(itm) {
			var ut = itm.get("unitType");

			var utObj = content.findBy("name", ut);

			if( utObj ) {
				utObj.name = ut;
			} else {
				var newObj = Ember.Object.create({
					name : ut
				});
				content.pushObject(newObj);
			}
		});
		return content;
    }),

    pmsUnitTypes : Ember.computed('content.[]', function() {
    	var content = Ember.ArrayProxy.create({ content : Ember.A([]) });
		this.get("content").forEach( function(itm) {
			var ut = itm.get("pmsUnitType");

			var utObj = content.findBy("name", ut);

			if( utObj ) {
				utObj.name = ut;
			} else {
				var newObj = Ember.Object.create({
					name : ut
				});
				content.pushObject(newObj);
			}
		});
		return content;
    })
});
