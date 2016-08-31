import Ember from 'ember';
import moment from 'moment';
import computedFilterByQuery from 'ember-cli-filter-by-query';

export default Ember.Controller.extend({
	dateFormat : "MMM D, YYYY",
	communityController : Ember.inject.controller("lro.pricingLeasing.community"),
	community : Ember.computed.reads("communityController.model"),

	pricingLeasingController : Ember.inject.controller("lro.pricingLeasing"),
	communities : Ember.computed.reads("pricingLeasingController.model"),

	currentDate : Date(),

	contentObserver : Ember.observer("content.[]", function() {

    	Ember.run.once(this, function() {
			let cols = ["unitType", "pmsUnitType"],
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
					let val = unit.get(filter.get("key")),
						b = filter.get("arr").findBy("text", val);

					if( !b ) {
						let newObj = Ember.Object.create({
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
    }),

	filteredContent : Ember.computed('model.[]', 'unitTypeFilter', 'pmsUnitTypeFilter', function() {

  		return this.get("model").filter(function(unit) {
			let f1 = true, // unitType
				f2 = true; // pmsUnitType


				if( this.get("unitTypeFilter") ) {
					if( unit.get("unitType") !== this.get("unitTypeFilter.text") ) {
						f1 = false;
					}
				}

				if( this.get("pmsUnitTypeFilter") ) {
					if( unit.get("pmsUnitType") !== this.get("pmsUnitTypeFilter.text") ) {
						f2 = false;
					}
				}

				return (f1 && f2);
		}, this);
  	}),

  	filteredSearchedContent : computedFilterByQuery('filteredContent', ['unitNumber','unitType','resident','pmsUnitType'], 'searchText')
});
