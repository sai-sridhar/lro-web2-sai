import DS from 'ember-data';

export default DS.Model.extend({
  	type : DS.attr("string"),
  	from : DS.attr("number"),
  	to : DS.attr("number"),
  	bringToMktRate : DS.attr("number"),
  	minIncrease : DS.attr("number"),
  	maxIncrease : DS.attr("number")
});
