import DS from 'ember-data';
var attr = DS.attr;
var hasMany = DS.hasMany;

export default DS.Model.extend({
	unitNumber 		: attr("string"),
	communityId 	: attr("number"),
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
