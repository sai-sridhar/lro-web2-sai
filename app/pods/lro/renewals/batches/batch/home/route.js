import Ember from 'ember';

export default Ember.Route.extend({

	model : function(params, transition) {
		return this.store.findRecord("renewalBatch", transition.params["lro.renewals.batches.batch"].batch_id);
	},
	setupController : function(controller, model) {
		this._super(controller, model);
		if( !controller.get("detailView") ) {
			controller.set("detailView", "community");
		}

		controller.set("bedsFilter", null);
		controller.set("bathsFilter", null);
		controller.set("unitTypeFilter", null);
		controller.set("pmsUnitTypeFilter", null);
		controller.set("overrideUnitFilter", false);
		controller.set("communityFilter", false);
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
		controller.set("unapprovedCommunityFilter", false);
		controller.set("overrideCommunityFilter", false);
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
								forDeleteComms = comms.toArray();

							forDeleteComms.forEach( function(comm) {
								var units = comm.get("units"),
									forDeleteUnits = units.toArray();

								forDeleteUnits.forEach( function(unit) {
									unit.deleteRecord();
									unit.save();
									units.removeObject(unit);
								});

								comm.deleteRecord();
								comm.save();
								comms.removeObject(comm);
							});

							self.store.query("renewalRange", { batch : batch.get("id") }).then( (ranges) => {
								var forDeleteRanges = ranges.toArray();
								forDeleteRanges.forEach(function(range) {
									range.deleteRecord();
									range.save();
									ranges.removeObject(range);
								});
							});

							batch.deleteRecord();
							batch.save().then( () => {
								swal("Deleted!", "Your batch has been deleted.", "success");
								self.transitionTo("lro.renewals.batches.home.open");
							});
						}
					}
				);

			});
		},
		closeBatch : function() {
			if( this.controller.get("model.isCommitted") ) {
				this.transitionTo("lro.renewals.batches.home.committed");
			} else {
				this.transitionTo("lro.renewals.batches.home.open");
			}
		},
		commitBatch : function() {
			this.controller.set("model.status", "Committed");
			this.controller.get("model").save();
			this.transitionTo("lro.renewals.batches.home.committed");
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
			var units = Ember.ArrayProxy.create({ content : Ember.A([]) });
			this.controller.get("model.communities").forEach(function(comm) {
				comm.get("units").forEach(function(unit) {
					units.pushObject(unit);
				});
			});

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
		clearUnitFilters : function() {
			this.controller.set("bedsFilter", null);
			this.controller.set("bathsFilter", null);
			this.controller.set("unitTypeFilter", null);
			this.controller.set("pmsUnitTypeFilter", null);
			this.controller.set("overrideUnitFilter", false);
			this.controller.set("communityFilter", false);
			this.controller.set("unapprovedUnitFilter", false);

			this.controller.set("minIncFilter", null);
			this.controller.set("maxIncFilter", null);

			this.controller.set("minCurrentDtmFilter", null);
			this.controller.set("minCurrentDtmFilter", null);

			this.controller.set("minNewDtmFilter", null);
			this.controller.set("maxNewDtmFilter", null);
		},
		clearCommunityFilters : function() {
			this.controller.set("minAvgIncFilter", null);
			this.controller.set("maxAvgIncFilter", null);

			this.controller.set("minAvgCurrentDtmFilter", null);
			this.controller.set("maxAvgCurrentDtmFilter", null);

			this.controller.set("minAvgNewDtmFilter", null);
			this.controller.set("maxAvgNewDtmFilter", null);

			this.controller.set("unapprovedCommunityFilter", false);
			this.controller.set("overrideCommunityFilter", false);
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
		sortCommunities : function(prop) {
			// What is the current communitySortBy property
			var sort = this.controller.get("communitySortBy.firstObject").split(":"),
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
			this.controller.set("communitySortBy", [ prop+":"+direction]);
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
		approveFilteredCommunities : function() {
			let units = Ember.ArrayProxy.create({ content : Ember.A([]) }),
				length = this.controller.get("filteredCommunityContent.length");
			this.controller.get("filteredCommunityContent").forEach(function(comm) {
				comm.get("units").forEach(function(unit) {
					units.pushObject(unit);
				});
			});

			swal(
				{  	title: "Approve?",
					text: "Approve renewal offers for " + length + " communities?",
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
		}
	}
});
