import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({

	lroController : Ember.inject.controller("lro"),
	user : Ember.computed.reads("lroController.user"),

	dateFormat : "MMM D, YYYY",
	selectedMonth : null,

	startDate : null,
	startDateBegin : moment().toDate(),
	startDateEnd : moment().add(7, "months").toDate(),

	endDate : null,
	endDateBegin : moment().toDate(),
	endDateEnd : moment().add(8, "months").toDate(),

	listContent : Ember.computed(function() {
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
