import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
	renewalComm : DS.belongsTo("renewalComm", { async : true }),
	// batch : DS.belongsTo("renewalBatch", { async : true }),
	// community : DS.belongsTo("community", { async : true }),
	communityName : Ember.computed("renewalComm", function() {
		return this.get("renewalComm.communityFullName");
	}),
	unitNumber : DS.attr("string"),
	unitType : DS.attr("string"),
	pmsUnitType : DS.attr("string"),
	beds : DS.attr("number"),
	baths : DS.attr("number"),
	renewalDate : DS.attr("momentDate"),
	resident : DS.attr("string"),
	amenities : DS.attr("string"),
	amenityAmount : DS.attr("number"),
	currentLeaseTerm : DS.attr("number"),
	recLeaseTerm : DS.attr("number"),
	currentRent : DS.attr("number"),
	recRent : DS.attr("number"),
	cmr : DS.attr("number"),
	approved : DS.attr("boolean"),
	notice : DS.attr("boolean"),
	renewed : DS.attr("boolean"),
	undecided : DS.attr("boolean"),
	finalRecRent : DS.attr("number"),
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
	terms : DS.hasMany("renewalTerm", { async : true }),
	userOverridePct : DS.attr("number"),
	userOverrideDollars : DS.attr("number"),
	userOverrideMode : DS.attr("string"),

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
			this.set("finalRecRent", +this.get("currentRent") + +this.get("userOverrideDollars"));
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
