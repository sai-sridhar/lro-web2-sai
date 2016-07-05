import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
	renewalUnit : belongsTo("renewalUnit", { async : true }),
	term : attr("number"),
	baseRent : attr("number"),
	totalConcession : attr("number"),
	effectiveRent : attr("number"),
});
