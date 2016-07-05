import Model from 'ember-data/model';
import Ember from 'ember';
import attr from 'ember-data/attr';

export default Model.extend({
	name : attr("string"),
	code : attr("string"),
	fullName : Ember.computed("name", "code", function(){
		return this.get("name") + " (" + this.get("code") + ")";
	}),
	address1 : attr("string"),
	address2 : attr("string"),
	city : attr("string"),
	state : attr("string"),
	zip : attr("string"),
	country : attr("string"),
	poc : attr("string"),
	email : attr("string"),
	phone : attr("string"),
	website : attr("string"),
	yearBuilt : attr("number"),
	yearRenovated : attr("number"),
	propertySize : attr("number"),
	floors : attr("number"),
	units : attr("number"),
	mgmtCompany : attr("string"),
	ownerCompany : attr("string")
});
