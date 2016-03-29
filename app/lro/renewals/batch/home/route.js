import Ember from 'ember';

export default Ember.Route.extend({
	// model : function(params) {
	// 	return this.store.findRecord("renewalBatch", params.batch_id);
	// },
	// afterModel : function(params) {
	// 	this.store.query('renewalComm', { batch : params.batch_id });
	// 	this.store.query('renewalUnit', { batch : params.batch_id });
	// },

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
		unapproveCommunity : function(comm) {
			var commName = comm.get("community.name");

			this.store.query("renewalUnit", { renewalComm : comm.get("id") }).then( (units) => {
				swal(
					{  	title: "Unapprove?",
						text: "Unapprove all renewal offers for " + commName + "?",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#51bc6a",
						confirmButtonText: "Yes, unapprove all",
						cancelButtonText: "No, cancel",
						closeOnConfirm: true,
						closeOnCancel: true
					},
					function (isConfirm) {
						if( isConfirm ) {
							units.forEach(function(unit) {
								unit.set("approved", false);
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
		},
		approveUnit : function(unit) {
			swal(
				{  	title: "Approve?",
					text: "Renewal offer: " + unit.get("recLeaseTerm") + " months @ $" + unit.get("finalRecRent"),
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#51bc6a",
					confirmButtonText: "Yes, approve it",
					cancelButtonText: "No, cancel",
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function (isConfirm) {
					if( isConfirm ) {
						unit.set("approved", true);
						unit.save();
					}
				}
			);
		},
		unapproveUnit : function(unit) {
			swal(
				{  	title: "Unapprove?",
					text: "Renewal offer: " + unit.get("recLeaseTerm") + " months @ $" + unit.get("finalRecRent"),
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#51bc6a",
					confirmButtonText: "Yes, unapprove it",
					cancelButtonText: "No, cancel",
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function (isConfirm) {
					if( isConfirm ) {
						unit.set("approved", false);
						unit.save();
					}

				}
			);
		},
		increaseSlide : function(val) {
			this.controller.set("increaseMin", val[0]);
			this.controller.set("increaseMax", val[1]);
		},
		currentDtmSlide : function(val) {
			this.controller.set("currentDtmMin", val[0]);
			this.controller.set("currentDtmMax", val[1]);
		},
		newDtmSlide : function(val) {
			this.controller.set("newDtmMin", val[0]);
			this.controller.set("newDtmMax", val[1]);
		},
		clearUnitFilters : function() {
			this.controller.set("bedsFilter", null);
			this.controller.set("bathsFilter", null);
			this.controller.set("unitTypeFilter", null);
			this.controller.set("pmsUnitTypeFilter", null);
			this.controller.set("overrideFilter", false);

			this.controller.set("increaseMin", this.controller.get("model.minIncrease") * 100);
			this.controller.set("increaseMax", this.controller.get("model.maxIncrease") * 100);

			this.controller.set("currentDtmMin", this.controller.get("model.minCurrentDiscountToMarket") * 100);
			this.controller.set("currentDtmMax", this.controller.get("model.maxCurrentDiscountToMarket") * 100);

			this.controller.set("newDtmMin", this.controller.get("model.minNewDiscountToMarket") * 100);
			this.controller.set("newDtmMax", this.controller.get("model.maxNewDiscountToMarket") * 100);
		}

	}
});
