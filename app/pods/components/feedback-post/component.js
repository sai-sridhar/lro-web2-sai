import Ember from 'ember';

export default Ember.Component.extend({
	store : Ember.inject.service(),

	iCreated : Ember.computed("user", "model.createdBy", function() {
		return this.get("user._id") === this.get("model.createdBy.id") ? true : false;
	}),

	actions : {
		initAddComment() {
			this.set("addingComment", true);
		},
		addComment() {
			let store = this.get("store");

			store.findRecord("user", this.get("user._id")).then( (user) => {
				store.findRecord("post", this.get("model.id")).then( (post) => {
					let newComment = store.createRecord("comment", {
						post : post,
						comment : this.get("newComment"),
						createdBy : user,
						dateCreated : moment()
					});
					newComment.save().then( () => {
						this.send("cancelAddComment");
					});
				});
			});
		},
		cancelAddComment() {
			this.setProperties({
				addingComment : false,
				newComment : null
			});
		},
		toggleComments() {
			this.toggleProperty("showComments");
		},
		deletePost() {
			this.get("store").findRecord('post', this.get("model.id")).then( (post) => {
				swal(
					{  	title: "Are you sure?",
						text: "You will not be able to recover this post!",
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
							let comments = post.get("comments"),
								forDeleteComments = comments.toArray();

							forDeleteComments.forEach( function(comment) {
								comment.deleteRecord();
								comment.save();
								comments.removeObject(comment);
							});

							post.deleteRecord();
							post.save().then( () => {
								swal("Deleted!", "Your post has been deleted.", "success");
							});
						}
					}
				);
			});
		},
	}
});
