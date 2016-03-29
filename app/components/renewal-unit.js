import Ember from 'ember';

export default Ember.Component.extend({

	actions : {
		close : function() {
			this.sendAction("close");
		},
		initOverride : function() {
			this.set("isOverriding", true);
		},
		cancelOverride : function() {
			this.set("isOverriding", false);
		},
		saveOverride : function() {
			this.get("model").save().then( () => {
				this.set("isOverriding", false);
			});
		},
		clearOverride : function() {
			this.set("model.userOverrideMode", null);
			this.set("model.userOverridePct", null);
			this.set("model.userOverrideDollars", null);
			this.get("model").save().then( () => {
				this.set("isOverriding", false);
			});
		},
		approve : function(unit) {
			var self = this;
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
						unit.save().then( () => {
							self.sendAction("close");
						});
					}
				}
			);
		},
		unapprove : function(unit) {
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
		}
	}
});
