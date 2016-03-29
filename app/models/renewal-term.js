import DS from 'ember-data';

export default DS.Model.extend({
	renewalUnit : DS.belongsTo("renewalUnit", { async : true }),
	term : DS.attr("number"),
	baseRent : DS.attr("number"),
	totalConcession : DS.attr("number"),
	effectiveRent : DS.attr("number"),
});
