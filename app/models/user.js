
import Model from 'ember-data/model';
import Ember from 'ember';
import attr from 'ember-data/attr';

export default Model.extend({
	email : attr("string"),
	password : attr("string"),
	firstName : attr("string"),
	lastName : attr("string"),
	fullName : Ember.computed("firstName", "lastName", function() {
		return this.get("firstName") + " " + this.get("lastName");
	})
});
