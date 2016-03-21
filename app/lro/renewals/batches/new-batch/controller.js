import Ember from 'ember';

export default Ember.Controller.extend({

	listContent : Ember.ArrayProxy.create({ content : Ember.A([
		{	name: "March 2016",
			id: 1
		},
		{ 	name: "April 2016",
			id: 2
		},
		{	name: "May 2016",
			id: 3
		},
		{	name: "June 2016",
			id: 4
		},
		{	name: "July 2016",
			id: 5
		},
		{	name: "August 2016",
			id: 6
		},
		{	name: "September 2016",
			id: 7
		},
		{	name: "October 2016",
			id: 8
		},
		{	name: "November 2016",
			id: 9
		},
		{	name: "December 2016",
			id: 10
		}
	]) }),

	selectedMonth : Ember.computed('month', function() {
		return this.get("month.name");
	})

});
