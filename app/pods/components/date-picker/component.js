import Ember from 'ember';
import moment from 'moment';

var isMom = moment.isMoment,
	dayObj,
	weekObj,
	empty = Ember.isEmpty,
	between;

export default Ember.Component.extend({
	weeksToRender : 9, // This affects render speed and scroll performance.
	rowHeight : 36,
	viewportHeight : 216,
	scrollTop : 0,
	prevDepth : null,
	currentMonth : null,
	showCalendar : false,
	mayAnimate : false,
	weeks : [],

	actions : {
		selectDate : function(date) {
			// Only allow date selection in the range provided.
			if( between(date, this.get("startDate"), this.get("endDate")) ) {
				this.set("showCalendar", false);
				this.set("currentDate", date);
				$("body").off("click", this.get("clickCallback"));
			}
		},
		openCalendar : function() {

			var that = this, cb;

			this.set("showCalendar", true);
			this.set("mayAnimate", false);

			cb = function() {
				that.set("showCalendar", false);
			};

			$("body").one("click", cb);
			this.set("clickCallback", cb);

			Ember.run.scheduleOnce("afterRender", this, function() {
				this.centerCalendar(this.get("currentDate"));
				this.set("mayAnimate", true);
			});
		},
		nextMonth : function() {
			this.centerCalendar( this.get("currentMonth").clone().add(1, "month") );
		},
		prevMonth : function() {
			this.centerCalendar( this.get("currentMonth").clone().subtract(1, "month") );
		},
		preventBubble : function() {
			return false;
		}
	},

	init : function() {
		// Ensure that the dates we're passed are moment objects.
		Ember.assert("Dates passed to infinite-calendar must be a moment objects.", isMom(this.get("currentDate")) && isMom(this.get("startDate")) && isMom(this.get("endDate")) );

		this._super();
		this.setupWeeks();
		this.set("currentMonth", this.get("currentDate"));
		this.set("rowHeight", +(this.get("rowHeight")));
		this.set("viewportHeight", +(this.get("viewportHeight")));

		window.cal = this;
	},

	centerCalendar : function(month) {
		var diff, hght;

		// Adjust the montht to the first day of the month.
		month = month.clone().startOf("month");

		// Centers the calendar view around the month of the date chosen.
		diff = month.diff(this.get("actualStartDate"), "weeks");
		hght = this.get("rowHeight");
		this.scrollTo(diff*hght - Math.round(hght/2), true);
	},

	setupWeeks : function() {
		var arr = [];

		for (var i = 0; i < this.get("weeksToRender"); i++) {
			arr.push( weekObj.create({
				step : i,
				calendar : this
			}) );
		}

		this.set("weeks", arr);
	},

	scrollTo : function(pos) {
		// Only animate if we're looking at the date.
		if( this.get("mayAnimate") ) {
			this.$(".scroll-content").animate({ scrollTop : pos });
		} else {
			this.$(".scroll-content").scrollTop(pos);
		}
	},

	actualStartDate : Ember.computed('startDate', function() {
		// Ensure week starts on a Sunday.
		var start = this.get("startDate");
		return start.clone().subtract(start.day(), "days");
	}),

	actualEndDate : Ember.computed('endDate', function() {
		// Ensure the range ends on a Saturday.
		var end = this.get("endDate");
		return end.clone().add(6 - end.day(), "days");
	}),

	totalCalendarWeeks : Ember.computed('actualEndDate', 'actualStartDate', function() {
		return this.get("actualEndDate").diff( this.get("actualStartDate"), "weeks" );
	}),

	scrollContentStyle : Ember.computed('totalCalendarWeeks', 'rowHeight', function() {
		var height = (this.get("totalCalendarWeeks") + 1) * this.get("rowHeight");
		return Ember.String.htmlSafe("height: %@px".fmt(height));
	}),

	didInsertElement : function() {
		$(".scroll-content").on("scroll", this.get("onScroll").bind(this));
	},

	willDestroyElement : function() {
		$(".scroll-content").off("scroll");
	},

	onScroll : function(e) {
		this.set("scrollTop", e.currentTarget.scrollTop);
	},

	monthObserver : Ember.observer('weeks.@each.step', function() {
		var row = Math.round(this.get("weeksToRender") / 2),
			day = 3, date;

		date = this.get("weeks").sortBy("step").objectAt(row)
					.get("days").objectAt(day).get("date");

		this.set("currentMonth", date);
	}),

	scrollDidChange : Ember.observer('scrollTop', function() {
		var top = this.get("scrollTop"),
			row = this.get("rowHeight"),
			obs = this.get("weeks"),
			prv = this.get("prevDepth"),
			depth, i, length, mult, mod;

		// Make the top scroll position buffer one row.
		top = (top > row) ? top - row : 0;

		// Depth is the integer representing how many
		// rows the user has scrolled.
		depth = Math.floor(top/row);
		length = obs.get("length");

		// Only update DOM if we've not done this depth yet.
		if( !empty(prv) && prv === depth ) {
			return;
		}

		this.set("prevDepth", depth);

		mult = Math.floor(depth/length);
		mod = depth % length;

		Ember.beginPropertyChanges();

		for(i=0; i < length; i++) {
			if( i < mod ) {
				// console.log(i, (length*(mult+1)) + i);
				obs.objectAt(i).set("step", (length*(mult+1)) + i);
			} else {
				// console.log(i, (length*mult) + i);
				obs.objectAt(i).set("step", (length*mult) + i);
			}
		}

		Ember.endPropertyChanges();
	})
});

weekObj = Ember.Object.extend({
	step : null,
	calendar : null,

	style : Ember.computed('step', 'calendar.rowHeight', function() {
		var offset = this.get("step") * this.get("calendar.rowHeight");
		return Ember.String.htmlSafe("-webkit-transform: translate(0,%@px)".fmt(offset));
	}),

	days : Ember.computed('calendar.actualStartDate', 'step', function() {
		var start = this.get("calendar.actualStartDate"),
			step = this.get("step"), current, week = this;

		current = start.clone().add(step, "weeks");

		// Create an array of each of the days.
		return Array.apply(null, new Array(7)).map(function(d,i) {
			return dayObj.create({
				week : week,
				date : current.clone().add(i, "days")
			});
		});
	})
});

dayObj = Ember.Object.extend({
	date : null,
	week : null,

	isCurrent : Ember.computed('date', 'week.calendar.currentDate', function() {
		return this.get("date").isSame(this.get("week.calendar.currentDate"), "day");
	}),

	isInMonth : Ember.computed('date', 'week.calendar.currentMonth', function() {
		return this.get("date").isSame(this.get("week.calendar.currentMonth"), "month");
	}),

	clickable : Ember.computed('date', 'week.calendar.{startDate,endDate}', function() {
		var date = this.get("date"),
			start = this.get("week.calendar.startDate"),
			end = this.get("week.calendar.endDate");

		return between(date, start, end);
	})
});

between = function(current, start, end) {
	return (current.isAfter(start, "day") || current.isSame(start,"day")) &&
			(current.isBefore(end, "day") || current.isSame(end,"day"));
};
