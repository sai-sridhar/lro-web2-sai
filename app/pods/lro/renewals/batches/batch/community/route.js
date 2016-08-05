import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params) {
		return this.store.findRecord("renewalComm", params.community_id);
	},
	setupController : function(controller, model) {
		this._super(controller, model);
		if( !controller.get("detailView") ) {
			controller.set("detailView", "summary");
		}

		controller.setProperties({
			"bedsFilter" : null,
			"bathsFilter" : null,
			"unitTypeFilter" : null,
			"pmsUnitTypeFilter" : null,
			"overrideUnitFilter" : false,
			"unapprovedUnitFilter" : false,
			"minIncFilter" : null,
			"maxIncFilter" : null,
			"minCurrentDtmFilter" : null,
			"maxCurrentDtmFilter" : null,
			"minNewDtmFilter" : null,
			"maxNewDtmFilter" : null,
			"minAvgIncFilter" : null,
			"maxAvgIncFilter" : null,
			"minAvgCurrentDtmFilter" : null,
			"maxAvgCurrentDtmFilter" : null,
			"minAvgNewDtmFilter" : null,
			"maxAvgNewDtmFilter" : null,
			"overrideUnitTypeFilter" : false,
			"unapprovedUnitTypeFilter" : false
		});
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
		toggleView : function(view) {
			this.controller.set("detailView", view);
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
		unapproveUnitType : function(ut) {
			var unitType = ut.get("unitType"),
				units = this.controller.get("model.units").filterBy("unitType", unitType);
			swal(
				{  	title: "Unapprove?",
					text: "Unapprove all renewal offers for unit type " + unitType + "?",
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
		},
		clearUnitFilters : function() {
			this.controller.setProperties({
				"bedsFilter" : null,
				"bathsFilter" : null,
				"unitTypeFilter" : null,
				"pmsUnitTypeFilter" : null,
				"overrideUnitFilter" : false,
				"unapprovedUnitFilter" : false,
				"minIncFilter" : null,
				"maxIncFilter" : null,
				"minCurrentDtmFilter" : null,
				"maxCurrentDtmFilter" : null,
				"minNewDtmFilter" : null,
				"maxNewDtmFilter" : null
			});
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
			this.controller.setProperties({
				"minAvgIncFilter" : null,
				"maxAvgIncFilter" : null,
				"minAvgCurrentDtmFilter" : null,
				"maxAvgCurrentDtmFilter" : null,
				"minAvgNewDtmFilter" : null,
				"maxAvgNewDtmFilter" : null,
				"overrideUnitTypeFilter" : false,
				"unapprovedUnitTypeFilter" : false
			});
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
		},
		approveFilteredUnits : function() {
			let units = Ember.ArrayProxy.create({ content : Ember.A([]) }),
				length = this.controller.get("filteredUnitContent.length");
			this.controller.get("filteredUnitContent").forEach(function(unit) {
				units.pushObject(unit);
			});

			swal(
				{  	title: "Approve?",
					text: "Approve renewal offers for " + length + " units?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#51bc6a",
					confirmButtonText: "Yes, approve",
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
		approveFilteredUnitTypes : function() {
			let units = Ember.ArrayProxy.create({ content : Ember.A([]) }),
				length = this.controller.get("filteredUnitTypeContent.length");
			this.controller.get("filteredUnitTypeContent").forEach(function(ut) {
				ut.get("units").forEach(function(unit) {
					units.pushObject(unit);
				});
			});

			swal(
				{  	title: "Approve?",
					text: "Approve renewal offers for " + length + " unit types?",
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
		filterToUnitType : function(ut) {
			// set the detail view to Unit
			this.send("toggleView", "unit");

			// set the LRO Unit Type filter to the unit type
			this.controller.set("unitTypeFilter", Ember.Object.create({
				id : ut.get("unitType"),
				text : ut.get("unitType")
			}));
		}
	}
});
