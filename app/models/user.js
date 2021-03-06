
import Model from 'ember-data/model';
import Ember from 'ember';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
	email : attr("string"),
	password : attr("string"),
	firstName : attr("string"),
	lastName : attr("string"),
	fullName : Ember.computed("firstName", "lastName", function() {
		return this.get("firstName") + " " + this.get("lastName");
	}),
	firstInitial : Ember.computed("firstName", function() {
		return this.get('firstName') ? this.get("firstName").charAt(0) : null;
	}),
	lastInitial : Ember.computed("lastName", function() {
		return this.get('lastName') ? this.get("lastName").charAt(0) : null;
	}),
	initials : Ember.computed("firstInitial", "lastInitial", function() {
		return this.get("firstInitial") + this.get("lastInitial");
	}),
	title : attr("string"),
	phone : attr("string"),
	status : attr("string", { defaultValue: "Active" }),
	isDeleted : attr("boolean", { defaultValue : false }),
	groups : hasMany("member", { async : true })
});
