import Ember from 'ember';

export default Ember.Component.extend({

	belowMarketContent : Ember.computed("content", function() {
		return this.get("content").filterBy("type", "below").sortBy("from");
	}),
	atMarketContent : Ember.computed("content", function() {
		return this.get("content").filterBy("type", "at");
	}),
	aboveMarketContent : Ember.computed("content", function() {
		return this.get("content").filterBy("type", "above").sortBy("from");
	}),

	addRange : "addRange",
	deleteRange : "deleteRange",
	saveRange : "saveRange",

	actions : {
		addRange : function(type) {
			console.log(type);
			// Add the range right before the last object
			// create the new ember model and then send an action
			this.sendAction("addRange", type);
		},
		deleteRange : function(range) {
			// check to see if the range is the last
			// if so, update the "to" value of the new last range

			range.save();
			// this.sendAction("saveRange", range);
		},
		saveRanges : function() {
			this.get("content").forEach(function(range) {
				range.save();
			})

		}
	}
});
