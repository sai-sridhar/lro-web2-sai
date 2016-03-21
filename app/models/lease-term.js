import DS from 'ember-data';
var attr = DS.attr;
var belongsTo = DS.belongsTo;

export default DS.Model.extend({
	term : attr("number"),
	baseRent : attr("number"),
	totalConcession : attr("number"),
	effectiveRent : attr("number"),
	newPricing : belongsTo("newPricing")
});
