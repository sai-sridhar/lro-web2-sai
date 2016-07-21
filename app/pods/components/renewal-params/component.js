import Ember from 'ember';


export default Ember.Component.extend({

	store : Ember.inject.service(),

	belowMarketContent : Ember.computed("content.[]", function() {
		let r = this.get("content").filterBy("type", "below").sortBy("from");
		r.set("firstObject.first", true);
		return r;
	}),
	atMarketContent : Ember.computed("content.[]", function() {
		return this.get("content").filterBy("type", "at");
	}),
	aboveMarketContent : Ember.computed("content.[]", function() {
		let r = this.get("content").filterBy("type", "above").sortBy("from");
		r.set("firstObject.first", true);
		return r;
	}),

	refresh : "refreshModel",

	actions : {
		addRange : function(type) {
			let len, from, newRange, lastRange, arr,
				store = this.get('store'),
				fo = this.get("content.firstObject");

			// Set the target array
			if( type === "below" ) {
				arr = this.get("belowMarketContent");
			} else if( type === "above") {
				arr = this.get("aboveMarketContent");
			}
			len = arr.get("length");

			lastRange = arr.get("lastObject");
			// Get the 'from' of the last range
			from = lastRange.get("from");
			// Set the 'to' of the lastRange to 'from'
			if( len === 1) {
				lastRange.set("to", 1);
			} else {
				lastRange.set("to", from);
			}
			// Create a new record with a 'to' value of NULL
			newRange = store.createRecord("renewalRange", {
				type : type,
				from : from + 1,
				to : null,
				batch : fo.get("batch"),
				renewalComm : fo.get("renewalComm"),
				community : fo.get("community"),
				unitType : fo.get("unitType"),
				isBatch : fo.get("isBatch"),
				isRenewalComm : fo.get("isRenewalComm"),
				isCommunity : fo.get("isCommunity"),
				isUnitType : fo.get("isUnitType")
			});
			// Save both records
			lastRange.save();
			newRange.save().then( () => {
				this.sendAction("refresh");
			});
		},
		deleteRange : function(range) {
			// Get the range type
			let type = range.get("type"),
				len, arr, newLastRange;

			// Set the target array
			if( type === "below" ) {
				arr = this.get("belowMarketContent");
			} else if( type === "above") {
				arr = this.get("aboveMarketContent");
			}

			len = arr.get("length");

			// check to see if the range is the last
			if( range === arr.get("lastObject") ) {
				// if so, update the "to" value of the next to last range
				newLastRange = arr.objectAt(len-2);
				newLastRange.set("to", null);
				newLastRange.save();
			}

			range.deleteRecord();
			range.save();
		},
		saveRanges : function() {
			this.get("content").forEach(function(range) {
				range.save();
			});
		}
	}
});
