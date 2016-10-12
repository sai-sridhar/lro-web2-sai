import Model from 'ember-data/model';
import Ember from 'ember';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
	user : belongsTo("user", { async : true } ),
	role : belongsTo("role", { async : true } ),
	grp : belongsTo("grp", { async : true } ),
	prop : belongsTo("community", { async : true }),
	type : attr("string")
});

