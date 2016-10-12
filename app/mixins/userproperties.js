import Ember from 'ember';

export default Ember.Mixin.create({
	addProperty : function(commId, commName, commCode, content, roleName, groupName) {

		let commObj = content.findBy("id", commId);

		if( commObj ) {
			commObj.get("roles").pushObject(Ember.Object.create({
				role : roleName,
				group : groupName
			}));
			commObj.multiple = true;
			commObj.length += 1;
		} else {
			let newObj = Ember.Object.create({
				id : commId,
				name : commName,
				code : commCode,
				multiple : false,
				length : 1,
				role : roleName,
				group : groupName,
				roles : []
			});
			content.pushObject(newObj);
		}
		// console.log("content", content);

		return content;
	},

});
