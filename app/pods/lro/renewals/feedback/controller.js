import Ember from 'ember';

export default Ember.Controller.extend({
	lroController : Ember.inject.controller("lro"),
	user : Ember.computed.reads("lroController.user"),

	sortPostsBy : ["dateCreated:desc"],
	sortedPosts : Ember.computed.sort("model", "sortPostsBy"),
});
