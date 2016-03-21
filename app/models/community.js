import DS from 'ember-data';
var attr = DS.attr;

export default DS.Model.extend({
	name : attr("string"),
	code : attr("string"),
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
	ownerCompany : attr("string"),
});
