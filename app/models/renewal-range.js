import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
    renewalComm : belongsTo("renewalComm", { async : true }),
    community : belongsTo("community", { async : true }),
    batch : belongsTo("renewalBatch", { async : true }),
    unitType : attr("string", { defaultValue : null}),
  	type : attr("string"),
  	from : attr("number"),
  	to : attr("number"),
  	bringToMktRate : attr("number"),
  	minIncrease : attr("number"),
  	maxIncrease : attr("number"),
    isBatch : attr("boolean", { defaultValue: false }),
    isRenewalComm : attr("boolean", { defaultValue: false }),
    isCommunity : attr("boolean", { defaultValue: false }),
    isUnitType : attr("boolean", { defaultValue: false })
});
