import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params) {
		return this.store.findRecord("renewalComm", params.community_id);
	},
	afterModel : function(params) {
		this.store.query('renewalUnit', { renewalComm : params.community_id });
	},
	actions : {
		deleteCommunity : function() {
			var self = this;

			this.store.findRecord('renewalComm', this.controller.get("model.id")).then( (community) => {
				swal(
					{  	title: "Are you sure?",
						text: "You will not be able to add this community back to the batch!",
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
							var units = community.get("units"),
								forDelete = units.toArray();

							forDelete.forEach( function(unit) {
								unit.deleteRecord();
								unit.save();
								units.removeObject(unit);
							});
							community.deleteRecord();
							community.save().then( () => {
								swal("Deleted!", "Your community has been deleted.", "success");
								self.transitionTo("lro.pricingLeasing.community.renewals.batch");
							});
						}
					}
				);

			});
		},
		closeCommunity : function() {
			this.transitionTo("lro.renewals.batch");
		},
		toggleParams : function() {
			this.controller.toggleProperty("showParams");
		},
		toggleTerms : function() {
			this.controller.toggleProperty("showTerms");
		},
		toggleUnitTypeView : function() {
			this.controller.set("unitTypeView", true);
			this.controller.set("unitView", false);
		},
		toggleUnitView : function() {
			this.controller.set("unitView", true);
			this.controller.set("unitTypeView", false);
		},
		openDetailFilterPane : function() {
			this.controller.set("showDetailFilters", true);
		},
		closeDetailFilterPane : function() {
			this.controller.set("showDetailFilters", false);
		},
		approveCommunity : function() {
			var self = this;
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
						self.controller.get("content.units").forEach(function(unit) {
							unit.set("approved", true);
							unit.save();
						});
					}
				}
			);
		},
		approveUnitType : function(ut) {
			var unitType = ut.get("unitType");
			var	units = this.controller.get("content.units").filterBy("unitType", unitType);

			swal(
				{  	title: "Approve?",
					text: "Approve all renewal offers for unit type " + unitType + "?",
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
		unapproveCommunity : function() {
			var self = this;
			swal(
				{  	title: "Unapprove?",
					text: "Unapprove all renewal offers?",
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
						self.controller.get("content.units").forEach(function(unit) {
							unit.set("approved", false);
							unit.save();
						});
					}
				}
			);
		}
	}
});
