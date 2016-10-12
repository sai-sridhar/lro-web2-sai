import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import Ember from 'ember';

export default Model.extend({
	comment : attr("string"),
	createdBy : belongsTo("user", { async : true }),
	dateCreated : attr("momentTime"),
	post : belongsTo("post", { async : true }),
	formattedDate : Ember.computed("dateCreated", function() {
		return moment(this.get("dateCreated")).fromNow();
	}),
});
