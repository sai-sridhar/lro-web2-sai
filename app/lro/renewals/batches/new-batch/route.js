import Ember from 'ember';

export default Ember.Route.extend({
	model : function() {
		return this.store.findAll("community");
	},

	actions : {
		selectCommunity : function(community) {
			community.toggleProperty("selected");
		},
		selectAll : function() {
			this.controller.get("model").setEach("selected", true);
		},
		deselectAll : function() {
			this.controller.get("model").setEach("selected", false);
		},
		createBatch : function() {
			var self = this;

			// create a new renewal-batch object
			var name = this.controller.get('batchName'),
				month = this.controller.get('selectedMonth');

			var newBatch = this.store.createRecord('renewalBatch', {
				name : name,
				month : month
			});

			// create the renewal-comm records
			this.controller.get("model").forEach(function(community) {
				if( community.selected ) {

					newBatch.get("communities").addObject(self.store.createRecord("renewalComm", {
						community : community,
						batch : newBatch
					}));
				}
			});

			newBatch.save().then( () => {
				var promises = Ember.A();

			    newBatch.get('communities').forEach(function(itm){
			        promises.push(itm.save());
			    });
			    Ember.RSVP.Promise.all(promises).then(function(resolvedPromises){
			        self.transitionTo("lro.renewals.batches.open");
			    });
			});
		}
	}
});
