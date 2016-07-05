import Ember from 'ember';
// var empty = Ember.isEmpty;

export default Ember.Component.extend({
	showList : false,
	name : "name",
	initialized : false,
	defaultSelectedId : null,
	all : true,
	content : null,

	// init : function() {
	// 	this._super();
	// // 	if( this.get("name") !== "name" ) {
	// // 		this.get("content").forEach(function(item) {
	// // 			item.set("name", item.get(this.get("name")) );
	// // 		}, this);
	// // 	}


	// },

	// contentObserver : Ember.observer("content.[]", function() {
	// 	if( this.get("content.length" ) ) {
	// 		this.get("content").forEach(function(item) {
	// 			item.set("name", item.get(this.get("name")) );
	// 		}, this);

	// 		if( this.get("all") ) {
	// 			console.log("is this being considered?");
	// 			this.get("content").pushObject(
	// 				Ember.Object.create({
	// 					id : 0,
	// 					name : "All"
	// 				})
	// 			);
	// 		}

	// 		if( !this.get("initialized") ) {
	// 			// Use the defaultSelectedId to set the selectedObject else, set it to the first content object.
	// 			if( empty(this.get("defaultSelectedId")) ) {
	// 				this.set("selectedObject", this.get("content.firstObject"));
	// 			} else {

	// 			}

	// 			this.set("initialized", true);
	// 		}
	// 	}
	// }),

	actions : {
		toggleList : function() {
			this.toggleProperty("showList");
		},
		selectObject : function(obj) {
			this.get("content").setEach("isSelected", false);

			this.set("selectedObject", obj);
			this.set("selectedObject.isSelected", true);

			this.set("showList", false);
		}
	}
});
