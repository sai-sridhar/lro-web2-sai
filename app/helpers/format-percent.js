import Ember from 'ember';

export function formatPercent(params) {
  	var value = params[0],
  		base,
  		round;

  	if( Ember.isEmpty(params[1]) ) {
  		base = 1;
  	} else {
  		base = params[1];
  	}

  	if( Ember.isEmpty(params[2]) ) {
  		round = 1;
  	} else {
  		round = params[2];
  	}

  	var mult = 100 / base;

  	if( isNaN(value) ) {
  		return Ember.String.htmlSafe("0%");
  	} else {
  		return Ember.String.htmlSafe( (+value * mult).toFixed(round) + "%" );
  	}

}

export default Ember.Helper.helper(formatPercent);
