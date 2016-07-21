import Ember from 'ember';

export default Ember.Component.extend({
	store : Ember.inject.service(),

	iCreated : Ember.computed("user", "model.createdBy", function() {
		return this.get("user._id") === this.get("model.createdBy.id") ? true : false;
	}),

	actions : {
		deleteComment() {
			let store = this.get("store");

			store.findRecord('comment', this.get("model.id")).then( (comment) => {
				swal(
					{  	title: "Are you sure?",
						text: "You will not be able to recover this comment!",
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
							comment.deleteRecord();
							comment.save().then( () => {
								swal("Deleted!", "Your comment has been deleted.", "success");
							});
						}
					}
				);

			});
		}
	}
});
