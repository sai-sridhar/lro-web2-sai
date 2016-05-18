import Ember from 'ember';

export default Ember.Route.extend({

	model : function(params) {
		return this.store.findAll("renewalRange");
	},

	actions : {
		saveRange : function(range) {
			console.log(range.get("bringToMktRate"));
			range.save();
		}

	}
});
