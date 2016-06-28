import DS from 'ember-data';

export default DS.Model.extend({
    renewalComm : DS.belongsTo("renewalComm", { async : true }),
    community : DS.belongsTo("community", { async : true }),
    batch : DS.belongsTo("renewalBatch", { async : true }),
    unitType : DS.attr("string", { defaultValue : null}),
  	type : DS.attr("string"),
  	from : DS.attr("number"),
  	to : DS.attr("number"),
  	bringToMktRate : DS.attr("number"),
  	minIncrease : DS.attr("number"),
  	maxIncrease : DS.attr("number"),
    isBatch : DS.attr("boolean", { defaultValue: false }),
    isRenewalComm : DS.attr("boolean", { defaultValue: false }),
    isCommunity : DS.attr("boolean", { defaultValue: false }),
    isUnitType : DS.attr("boolean", { defaultValue: false })
});
