import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
	unitNumber 		: attr("string"),
	community 		: belongsTo("community", { async : true }),
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
