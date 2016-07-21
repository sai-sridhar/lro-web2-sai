import Ember from 'ember';

export default Ember.Controller.extend({
	transitionToUnitType : Ember.observer("selectedUnitType", function() {
		this.transitionToRoute("lro.renewals.params.community.unitType", this.get("selectedUnitType.name"));
	})
});
