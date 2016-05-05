import DS from 'ember-data';
var attr = DS.attr,
	hasMany = DS.hasMany,
	belongsTo = DS.belongsTo;

export default DS.Model.extend({
	unitNumber 		: attr("string"),
	community	 	: belongsTo("community", { async : true }),
	priceDate 		: attr("string"),
	unitType 		: attr("string"),
	unitCategory 	: attr("string"),
	status 			: attr("string"),
	available 		: attr("momentDate"),
	moveout 		: attr("momentDate"),
	priorRent 		: attr("number"),
	sf 				: attr("number"),
	amenities 		: attr("string"),
	pmsUnitType 	: attr("string"),
	offset 			: attr("number"),
	amenityAmount 	: attr("number"),
	leaseTerm 		: attr("number"),
	baseRent 		: attr("number"),
	totalConcession : attr("number"),
	effectiveRent 	: attr("number"),
	leaseTerms 		: hasMany("leaseTerm", {async:true})
});
