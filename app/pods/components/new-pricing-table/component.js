import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['table-wrapper'],
	tagName : "section",

	groupedContent : Ember.computed('content.[]', function() {

		var content = Ember.ArrayProxy.create({ content : Ember.A([]) });
		// return content;

		this.get("content").forEach( function(itm) {
			var ut = itm.get("unitType");

			var utObj = content.findBy("unitType", ut);

			if( utObj ) {
				utObj.units.push(itm);
				utObj.count = utObj.units.length;
				utObj.minRent = utObj.units.reduce(function( prevValue, unit ) {
					return Math.min(prevValue, unit.get("effectiveRent"));
				}, 1000000);
				utObj.maxRent = utObj.units.reduce(function( prevValue, unit ) {
					return Math.max(prevValue, unit.get("effectiveRent"));
				}, 0);
			} else {
				var newObj = Ember.Object.create({
					unitType : ut,
					unitCategory : itm.get("unitCategory"),
					minRent : itm.get("effectiveRent"),
					maxRent : itm.get("effectiveRent"),
					units : [itm]
				});
				content.pushObject(newObj);
			}
		});
		return content;
  	}),
});
