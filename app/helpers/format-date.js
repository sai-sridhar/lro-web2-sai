import Ember from 'ember';
import moment from 'moment';

export function formatDate(params) {
  	var value = params[0],
  		  form;

  	if( Ember.isEmpty(params[1]) ) {
  		form = "L";
  	} else {
  		form = params[1];
  	}

	if( moment.isMoment( value ) ) {
		return Ember.String.htmlSafe( value.format(form) );
	}
}

export default Ember.Helper.helper(formatDate);
