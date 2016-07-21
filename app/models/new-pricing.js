import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
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
