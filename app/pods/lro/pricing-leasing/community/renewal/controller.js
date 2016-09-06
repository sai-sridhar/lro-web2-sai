import Ember from 'ember';
import moment from 'moment';
import computedFilterByQuery from 'ember-cli-filter-by-query';

export default Ember.Controller.extend({

	showDownloadMenu : false,

	communityController : Ember.inject.controller("lro.pricingLeasing.community"),
	community : Ember.computed.reads("communityController.model"),

	pricingLeasingController : Ember.inject.controller("lro.pricingLeasing"),
	communities : Ember.computed.reads("pricingLeasingController.model"),

	currentDate : Date(),
	dateFormat : "MMM D, YYYY",
	selectedMonth : null,

	startDate : null,
	startDateBegin : moment().toDate(),
	startDateEnd : moment().add(7, "months").toDate(),

	endDate : null,
	endDateBegin : moment().toDate(),
	endDateEnd : moment().add(8, "months").toDate(),

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

	filteredContent : Ember.computed('model.[]', 'unitTypeFilter', 'pmsUnitTypeFilter', 'startDate', 'endDate', function() {

  		return this.get("model").filter(function(unit) {
			let f1 = true, // unitType
				f2 = true, // pmsUnitType
				f3 = true, // expirationFrom
				f4 = true; // expirationTo

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

				if( this.get("startDate") ) {
					if( unit.get("renewalDate").isBefore(this.get("startDate")) ) {
					// if( unit.get("renewalDate") < this.get("startDate") ) {
						f3 = false;
					}
				}

				if( this.get("endDate") ) {
					if( unit.get("renewalDate").isAfter(this.get("endDate")) ) {
					// if( unit.get("renewalDate") > this.get("endDate") ) {
						f4 = false;
					}
				}

				return (f1 && f2 && f3 && f4);
		}, this);
  	}),

  	filteredSearchedContent : computedFilterByQuery('filteredContent', ['unitNumber','unitType','resident','pmsUnitType'], 'searchText'),

  	monthContent : Ember.computed(function() {
		var content = Ember.ArrayProxy.create({ content : Ember.A([])}),
			today = moment(),
			month,
			futureMonths = 8,
			text,
			start,
			end;

		for( var i = 0; i < futureMonths; i++ ) {
			month = today.clone().add(i, "months");
			text = month.format("MMMM YYYY");
			start = month.clone().startOf("month");
			end = month.clone().endOf("month");

			content.pushObject(Ember.Object.create({
				id : i,
				text : text,
				start : start,
				end : end
			}));
		}

		return content;
	}),

  	monthObserver : Ember.observer("month", function() {
		if( this.get("month") ) {
			this.set("startDate", this.get("month.start").toDate());
			this.set("endDate", this.get("month.end").toDate());
			this.set("selectedMonth", this.get("month.text"));
		}
	}),

  	actions : {
		changeStartDate : function(value) {
			this.set("startDate", moment(value).toDate());
			this.set("month", null);
		},
		changeEndDate : function(value) {
			this.set("endDate", moment(value).toDate());
			this.set("month", null);
		}
	}
});
