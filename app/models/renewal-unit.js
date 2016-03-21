import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
	renewalComm : DS.belongsTo("renewalComm"),
	batch : DS.belongsTo("renewalBatch"),
	unitId : DS.attr("string"),
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
	overrideRent : DS.attr("number"),
	overrideLeaseTerm : DS.attr("number"),
	increase : Ember.computed('currentRent', 'recRent', function() {
		return this.get("recRent") / this.get("currentRent") - 1;
	}),
	currentDiscountToMarket : Ember.computed('cmr', 'currentRent', function() {
		return 1 - (this.get("currentRent") / this.get("cmr"));
	}),
	newDiscountToMarket : Ember.computed('cmr', 'recRent', function() {
		return 1 - (this.get("recRent") / this.get("cmr"));
	})
});
