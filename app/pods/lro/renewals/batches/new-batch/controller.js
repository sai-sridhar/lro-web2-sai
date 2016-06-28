import Ember from 'ember';

export default Ember.Controller.extend({

	dateFormat : "MMM D, YYYY",
	selectedMonth : null,
	startDate : null,
	endDate : null,

	startDateBegin : moment(),
	startDateEnd : moment().add(7, "months"),

	endDateBegin : moment(),
	endDateEnd : moment().add(8, "months"),

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
			start = month.clone().startOf("month").format(this.get("dateFormat"));
			end = month.clone().endOf("month").format(this.get("dateFormat"));

			content.pushObject(Ember.Object.create({
				id : i,
				text : text,
				start : start,
				end : end
			}));
		}

		return content;
	}),

	dateObserver : Ember.observer("startDate", "endDate", function() {
		if( this.get("month") ) {
			if( (this.get("startDate") !== this.get("month.start")) || (this.get("endDate") !== this.get("month.end")) ) {
				// this.set("month", null);
			}
		}
	}),

	monthObserver : Ember.observer("month", function() {
		if( this.get("month") ) {
			this.set("startDate", this.get("month.start"));
			this.set("endDate", this.get("month.end"));
			this.set("selectedMonth", this.get("month.text"));
		} else {
			this.set("startDate", null);
			this.set("endDate", null);
			this.set("selectedMonth", null);
		}
	}),


});
