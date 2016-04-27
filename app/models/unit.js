import DS from 'ember-data';
var attr = DS.attr;

export default DS.Model.extend({
	unitNumber 		: attr("string"),
	community 		: DS.belongsTo("community", { async : true }),
	unitType 		: attr("string"),
	unitCategory 	: attr("string"),
	pmsUnitType 	: attr("string"),
	status 			: attr("string"),
	beds 			: attr("number"),
	baths			: attr("number"),
	cmr				: attr("number"),
	leaseStartDate : attr("momentDate"),
	leaseExpirationDate : attr("momentDate"),
	leaseCurrentRent : attr("number"),
	leaseCurrentTerm : attr("number"),
	leaseCurrentResident : attr("string")
});
