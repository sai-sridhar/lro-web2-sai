import Ember from 'ember';

export default Ember.Component.extend({
	showList : false,

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
