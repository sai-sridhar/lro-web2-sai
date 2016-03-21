import Ember from 'ember';

export function formatCommas(params) {
  	var value = params[0],
  		round;

  	if( Ember.isEmpty(params[1]) ) {
  		round = 0;
  	} else {
  		round = params[1];
  	}

  	if( !isNaN( parseFloat(value) ) ) {
		var nm = parseFloat(value);

		var x	= (nm.toFixed(round)+'').split('.'),
			x1	= x[0],
			x2	= x.length > 1 ? '.' + x[1] : '',
			rgx = /(\d+)(\d{3})/;

		while (rgx.test(x1))
		{ x1 = x1.replace(rgx, '$1' + ',' + '$2'); }

		return Ember.String.htmlSafe(x1 + x2);
	} else {
		return null;
	}
}

export default Ember.Helper.helper(formatCommas);
