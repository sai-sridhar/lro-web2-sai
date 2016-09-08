import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { hasMany } from 'ember-data/relationships';
import Ember from 'ember';

export default Model.extend({
	renewalComm : belongsTo("renewalComm", { async : true }),
	renewalRange : belongsTo("renewalRange", { async : true }),
	// batch : belongsTo("renewalBatch", { async : true }),
	community : belongsTo("community", { async : true }),
	communityName : Ember.computed("renewalComm", function() {
		return this.get("renewalComm.communityName");
	}),
	communityFullName : Ember.computed("renewalComm", function() {
		return this.get("renewalComm.communityFullName");
	}),
	communityCode : Ember.computed("renewalComm", function() {
		return this.get("renewalComm.communityCode");
	}),
	unitNumber : attr("string"),
	unitType : attr("string"),
	pmsUnitType : attr("string"),
	beds : attr("number"),
	baths : attr("number"),
	renewalDate : attr("momentDate"),
	resident : attr("string"),
	amenities : attr("string"),
	amenityAmount : attr("number"),
	currentLeaseTerm : attr("number"),
	recLeaseTerm : attr("number"),
	currentRent : attr("number"),
	recRent : attr("number"),
	cmr : attr("number"),
	approved : attr("boolean"),
	committed : attr("boolean"),
	notice : attr("boolean"),
	renewed : attr("boolean"),
	undecided : attr("boolean"),
	finalRecRent : attr("number"),
	lroIncreasePct : Ember.computed('currentRent', 'recRent', function() {
		return this.get("recRent") / this.get("currentRent") - 1;
	}),
	lroIncreaseDollars : Ember.computed("currentRent", "recRent", function() {
		return this.get("recRent") - this.get("currentRent");
	}),
	currentDiscountToMarket : Ember.computed('cmr', 'currentRent', function() {
		return (this.get("currentRent") / this.get("cmr")) - 1;
	}),
	newDiscountToMarket : Ember.computed('cmr', 'recRent', function() {
		return (this.get("recRent") / this.get("cmr")) - 1;
	}),
	finalDiscountToMarket : Ember.computed('cmr', "finalRecRent", function() {
		return (this.get("finalRecRent") / this.get("cmr")) - 1;
	}),
	terms : hasMany("renewalTerm", { async : true }),
	userOverridePct : attr("number"),
	userOverrideDollars : attr("number"),
	userOverrideMode : attr("string", { defaultValue : null}),

	overrideChanged : Ember.observer("userOverridePct", "userOverrideDollars", "userOverrideMode", function() {
		if( this.get("userOverrideMode") === "percent" ) {
			this.set("userOverridePctBoolean", true);
			this.set("userOverrideDollars", null);
		} else {
			this.set("userOverridePctBoolean", false);
		}

		if( this.get("userOverrideMode") === "dollars" ) {
			this.set("userOverrideDollarsBoolean", true);
			this.set("userOverridePct", null);
		} else {
			this.set("userOverrideDollarsBoolean", false);
		}

		if( this.get("userOverrideDollarsBoolean") ) {
			this.set("finalRecRent", (+this.get("currentRent")) + (+this.get("userOverrideDollars")));
		} else if( this.get("userOverridePctBoolean") ) {
			this.set("finalRecRent", this.get("currentRent") * (1 + this.get("userOverridePct") / 100));
		} else {
			this.set("finalRecRent", this.get("recRent"));
		}
	}),

	userIncreasePct : Ember.computed("finalRecRent", function() {
		var cr;
		if( this.get("currentRent") === 0 ) {
			cr = 1;
		} else {
			cr = this.get("currentRent");
		}
		return this.get("finalRecRent") / cr - 1;
	}),
	userIncreaseDollars : Ember.computed("finalRecRent", function() {
		return +this.get("finalRecRent") - +this.get("currentRent");
	})

});
