import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params) {
		return this.store.findRecord("renewalBatch", params.batch_id);
	},
	afterModel : function(params) {
		this.store.query('renewalComm', { batch : params.batch_id });
		this.store.query('renewalUnit', { batch : params.batch_id });
	},
	actions : {
		deleteBatch : function() {
			var self = this;

			this.store.findRecord('renewalBatch', this.controller.get("model.id")).then( (batch) => {
				swal(
					{  	title: "Are you sure?",
						text: "You will not be able to recover this batch!",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "Yes, delete it",
						cancelButtonText: "No, cancel",
						closeOnConfirm: false,
						closeOnCancel: true
					},
					function (isConfirm) {
						if (isConfirm) {
							var comms = batch.get("communities"),
								forDelete = comms.toArray();

							forDelete.forEach( function(comm) {
								comm.deleteRecord();
								comm.save();
								comms.removeObject(comm);
							});
							batch.deleteRecord();
							batch.save().then( () => {
								swal("Deleted!", "Your batch has been deleted.", "success");
								self.transitionTo("lro.pricingLeasing.community.renewals");
							});
						}
					}
				);

			});
		},
		closeBatch : function() {
			window.history.back();
		},
		toggleParams : function() {
			this.controller.toggleProperty("showParams");
		},
		toggleTerms : function() {
			this.controller.toggleProperty("showTerms");
		},
		toggleCommunityView : function() {
			this.controller.set("communityView", true);
			this.controller.set("unitView", false);
		},
		toggleUnitView : function() {
			this.controller.set("unitView", true);
			this.controller.set("communityView", false);
		},
		openDetailFilterPane : function() {
			this.controller.set("showDetailFilters", true);
		},
		closeDetailFilterPane : function() {
			this.controller.set("showDetailFilters", false);
		}
	}
});
