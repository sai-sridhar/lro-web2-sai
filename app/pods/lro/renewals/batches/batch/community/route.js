import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params, transition) {
		return this.store.findRecord("renewalComm", params.community_id);
	},
	setupController : function(controller, model) {
		this._super(controller, model);
		if( !controller.get("detailView") ) {
			controller.set("detailView", "unitType");
		}

		controller.set("bedsFilter", null);
		controller.set("bathsFilter", null);
		controller.set("unitTypeFilter", null);
		controller.set("pmsUnitTypeFilter", null);
		controller.set("overrideUnitFilter", false);
		controller.set("unapprovedUnitFilter", false);
		controller.set("minIncFilter", null);
		controller.set("maxIncFilter", null);
		controller.set("minCurrentDtmFilter", null);
		controller.set("minCurrentDtmFilter", null);
		controller.set("minNewDtmFilter", null);
		controller.set("maxNewDtmFilter", null);

		controller.set("minAvgIncFilter", null);
		controller.set("maxAvgIncFilter", null);
		controller.set("minAvgCurrentDtmFilter", null);
		controller.set("maxAvgCurrentDtmFilter", null);
		controller.set("minAvgNewDtmFilter", null);
		controller.set("maxAvgNewDtmFilter", null);
		controller.set("overrideUnitTypeFilter", false);
		controller.set("unapprovedUnitTypeFilter", false);
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
								self.transitionTo("lro.renewals.batches.batch.home");
							});
						}
					}
				);

			});
		},
		closeCommunity : function() {
			this.transitionTo("lro.renewals.batches.batch.home");
		},
		toggleUnitTypeView : function() {
			this.controller.set("detailView", "unitType");
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
						self.controller.get("model.units").forEach(function(unit) {
							unit.set("approved", true);
							unit.save();
						});
					}
				}
			);
		},
		approveUnitType : function(ut) {
			var unitType = ut.get("unitType"),
				units = this.controller.get("model.units").filterBy("unitType", unitType);

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
						self.controller.get("model.units").forEach(function(unit) {
							unit.set("approved", false);
							unit.save();
						});
					}
				}
			);
		},
		clearUnitFilters : function() {
			this.controller.set("bedsFilter", null);
			this.controller.set("bathsFilter", null);
			this.controller.set("unitTypeFilter", null);
			this.controller.set("pmsUnitTypeFilter", null);
			this.controller.set("overrideUnitFilter", false);
			this.controller.set("unapprovedUnitFilter", false);

			this.controller.set("minIncFilter", null);
			this.controller.set("maxIncFilter", null);

			this.controller.set("minCurrentDtmFilter", null);
			this.controller.set("minCurrentDtmFilter", null);

			this.controller.set("minNewDtmFilter", null);
			this.controller.set("maxNewDtmFilter", null);
		},
		sortUnits : function(prop) {
			// What is the current unitSortBy property
			var sort = this.controller.get("unitSortBy.firstObject").split(":"),
				currentProp = sort.get("firstObject"),
				direction = sort.get("lastObject");

			// If it is the same as what was clicked on, reverse the direction
			if( prop === currentProp ) {
				if( direction === "asc" ) {
					direction = "desc";
				} else {
					direction = "asc";
				}
			} else {
				direction = "asc";
			}
			this.controller.set("unitSortBy", [ prop+":"+direction]);
		},
		clearUnitTypeFilters : function() {
			this.controller.set("minAvgIncFilter", null);
			this.controller.set("maxAvgIncFilter", null);
			this.controller.set("minAvgCurrentDtmFilter", null);
			this.controller.set("maxAvgCurrentDtmFilter", null);
			this.controller.set("minAvgNewDtmFilter", null);
			this.controller.set("maxAvgNewDtmFilter", null);
			this.controller.set("overrideUnitTypeFilter", false);
			this.controller.set("unapprovedUnitTypeFilter", false);
		},
		sortUnitTypes : function(prop) {
			// What is the current unitTypeSortBy property
			var sort = this.controller.get("unitTypeSortBy.firstObject").split(":"),
				currentProp = sort.get("firstObject"),
				direction = sort.get("lastObject");

			// If it is the same as what was clicked on, reverse the direction
			if( prop === currentProp ) {
				if( direction === "asc" ) {
					direction = "desc";
				} else {
					direction = "asc";
				}
			} else {
				direction = "asc";
			}
			this.controller.set("unitTypeSortBy", [ prop+":"+direction]);
		}
	}
});