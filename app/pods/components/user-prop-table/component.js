import Ember from 'ember';

export default Ember.Component.extend({
	tagName : "section",
	classNames : ["table"],

	store: Ember.inject.service(),

	groupedContent : Ember.computed("model.groups.@each.grp", "model.groups.@each.user", "model.groups.@each.role", function() {
		let content = Ember.ArrayProxy.create({ content : Ember.A([]) }),
			store = this.get("store");

		store.findAll("community").then( () => {
			store.findAll("role").then( () => {

				this.get("model.groups").forEach( function(group) {
					let type = group.get("type"),
						roleName = group.get("role.roleName"),
						groupComms, userComm, groupName, commId, commName, commCode;

					if( type == "group") {
						groupComms = group.get("grp.communities")

						if( groupComms ) {
							groupName = group.get("grp.grpName");
							groupComms.forEach(function(comm) {
								commId = comm.get("id");
								commName = comm.get("name");
								commCode = comm.get("code");

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
							});
						}
					}
					else if( type == "prop" ) {
						userComm = group.get("prop"),
						groupName = "Explicit";
						commId = userComm.get("id");
						commName = userComm.get("name");
						commCode = userComm.get("code");
						// call a mixin, send the comm and content array
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
					}
				}, this);
			});
		});

		return content;
	})
});
