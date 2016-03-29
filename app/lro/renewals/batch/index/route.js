import Ember from 'ember';

export default Ember.Route.extend({
	redirect : function() {
		this.transitionTo("lro.renewals.batch.home");
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
								self.transitionTo("lro.renewals.open");
							});
						}
					}
				);

			});
		},
		closeBatch : function() {
			this.transitionTo("lro.renewals.batches.open");
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
		},
		approveCommunity : function(comm) {
			var commName = comm.get("community.name");

			this.store.query("renewalUnit", { renewalComm : comm.get("id") }).then( (units) => {
				swal(
					{  	title: "Approve?",
						text: "Approve all renewal offers for " + commName + "?",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#51bc6a",
						confirmButtonText: "Yes, approve all",
						cancelButtonText: "No, cancel",
						closeOnConfirm: true,
						closeOnCancel: true
					},
					function (isConfirm) {
						if( isConfirm ) {
							units.forEach(function(unit) {
								unit.set("approved", true);
								unit.save();
							});
						}
					}
				);
			});
		},
		approveBatch : function() {
			var self = this;

			this.store.query("renewalUnit", { batch : this.controller.get("model.id") }).then( (units) => {
				swal(
					{  	title: "Approve?",
						text: "Approve all renewal offers?",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#51bc6a",
						confirmButtonText: "Yes, approve all",
						cancelButtonText: "No, cancel",
						closeOnConfirm: true,
						closeOnCancel: true
					},
					function (isConfirm) {
						if( isConfirm ) {
							units.forEach(function(unit) {
								unit.set("approved", true);
								unit.save();
							});
						}
					}
				);
			});
		}
	}
});
