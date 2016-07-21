import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.query("post", { type : "renewal manager" });
	},
	actions : {
		initAddPost() {
			this.controller.set("addingPost", true);
		},
		addPost() {
			this.store.findRecord("user", this.controller.get("user._id")).then( (user) => {
				let newPost = this.store.createRecord("post", {
					post : this.controller.get("newPost"),
					type : "renewal manager",
					createdBy : user,
					dateCreated : moment()
				});
				newPost.save().then( () => {
					this.send("cancelAddPost");
					this.refresh();
				});
			});
		},
		cancelAddPost() {
			this.controller.setProperties({
				addingPost : false,
				newPost : null
			});
		}
	}
});
