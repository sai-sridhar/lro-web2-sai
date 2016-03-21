import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(str) {
  	return moment(str, "YYYY-MM-DD");
  },

  serialize(mom) {
  	if( moment.isMoment(mom) ) {
		var dt = mom.format("YYYY-MM-DD");
		return dt;
	} else {
		return null;
	}
  }
});
