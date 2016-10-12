import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
	grpName : attr("string"),
	members : hasMany("member", { async : true }),
	communities : hasMany("community", { async : true })
});
