import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
	customer : attr("string"),
	autoGenerateBatches : attr("boolean"),
	batchGenFrequency : attr("string"),
	batchGenLeadTime : attr("number"),
	batchNumDaysToInclude : attr("number"),
	autoApprove : attr("boolean"),
	autoCommit : attr("boolean")
});
