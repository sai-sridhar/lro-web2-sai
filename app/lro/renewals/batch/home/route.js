import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params, transition) {
		return this.store.findRecord("renewalBatch", transition.params["lro.renewals.batch"].batch_id);
	},
	afterModel : function(params, transition) {
		this.store.query('renewalComm', { batch : transition.params["lro.renewals.batch"].batch_id });
		this.store.query('renewalUnit', { batch : transition.params["lro.renewals.batch"].batch_id });
	},

	setupController : function(controller, model) {
		this._super(controller, model);
		if( !controller.get("detailView") ) {
			controller.set("detailView", "community");
		}

		controller.set("communityContent", Ember.ArrayProxy.create({ content : Ember.A([]) }));
		this.store.query('renewalComm', { batch : model.get("id") }).then( (communities) => {
			communities.forEach(function(comm) {
				var newObj = Ember.Object.create({
					id : comm.get("community.id")
				});

				this.store.findRecord("community", comm.get("community.id")).then( (community) => {
					newObj.set("text", community.get("name"));
					newObj.set("description", community.get("code"));
				});

				controller.get("communityContent").pushObject(newObj);
			}, this);
		});
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
			this.controller.set("detailView", "community");
		},
		toggleUnitView : function() {
			this.controller.set("detailView", "unit");
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
			this.controller.set("overrideUnitFilter", false);
			this.controller.set("communityFilter", false);
			this.controller.set("unapprovedUnitFilter", false);

			this.controller.set("increaseMin", this.controller.get("model.minIncrease") * 100);
			this.controller.set("increaseMax", this.controller.get("model.maxIncrease") * 100);

			this.controller.set("currentDtmMin", this.controller.get("model.minCurrentDiscountToMarket") * 100);
			this.controller.set("currentDtmMax", this.controller.get("model.maxCurrentDiscountToMarket") * 100);

			this.controller.set("newDtmMin", this.controller.get("model.minNewDiscountToMarket") * 100);
			this.controller.set("newDtmMax", this.controller.get("model.maxNewDiscountToMarket") * 100);
		},
		avgIncreaseSlide : function(val) {
			this.controller.set("avgIncreaseMin", val[0]);
			this.controller.set("avgIncreaseMax", val[1]);
		},
		clearCommunityFilters : function() {
			this.controller.set("avgIncreaseMin", this.controller.get("avgIncreaseRange.min"));
			this.controller.set("avgIncreaseMax", this.controller.get("avgIncreaseRange.max"));

			this.controller.set("unapprovedCommunityFilter", false);
			this.controller.set("overrideCommunityFilter", false);
		},
		selectAllTerms : function() {
			this.controller.get("leaseTermCategories").forEach(function(ltc) {
				ltc.set("isChecked", true);
				ltc.get("terms").setEach("isChecked", true);
			});
		},
		deselectAllTerms : function() {
			this.controller.get("leaseTermCategories").forEach(function(ltc) {
				ltc.set("isChecked", false);
				ltc.get("terms").setEach("isChecked", false);
			});
		},
		selectCommunityForTerms : function(comm) {
			comm.toggleProperty("selectedForTerms");
		},
		selectAllForTerms : function() {
			this.controller.get("communityContent").setEach("selectedForTerms", true);
		},
		deselectAllForTerms : function() {
			this.controller.get("communityContent").setEach("selectedForTerms", false);
		}
	}
});
