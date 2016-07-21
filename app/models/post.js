import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Ember from 'ember';

export default Model.extend({
	post : attr("string"),
	type : attr("string"),
	comments : hasMany("comment", { async : true }),
	createdBy : belongsTo("user", { async : true }),
	dateCreated : attr("momentTime"),
	formattedDate : Ember.computed("dateCreated", function() {
		return moment(this.get("dateCreated")).fromNow();
	}),
	commentString : Ember.computed("comments.length", function() {
		if( this.get("comments.length") === 1 ) {
			return "comment";
		} else {
			return "comments";
		}
	}),
	commentSort : ["dateCreated:asc"],
	sortedComments : Ember.computed.sort("comments", "commentSort")
});
