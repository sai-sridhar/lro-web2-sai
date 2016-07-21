import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(str) {
  	return moment(str).format();
  },

  serialize(mom) {
  	if( moment.isMoment(mom) ) {
  		var dt = mom;
  		return dt;
  	} else {
  		return null;
  	}
  }
});
