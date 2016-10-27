import Ember from 'ember';

export default Ember.Controller.extend({
    lroController : Ember.inject.controller("lro"),
	user : Ember.computed.reads("lroController.user"),
	password : "",
    confirmPassword : "",
	passwordHint : "",
    testProp : Ember.computed("password", "confirmPassword", function() {		
		return (this.get("password") === this.get("confirmPassword"));
	}),	

	actions : {
		saveUser : function() {
			this.get("model").save();
			this.send("saveAll")
			this.send('previousRoute');								
		},

		previousRoute: function(){          
			console.log("route here");
			var route = localStorage["lastVisitedRoute"] || "my_list";
			console.log(route);
			if (route == "lro.dashboard"){
				this.transitionToRoute(route);
			} else {
				this.transitionToRoute("lro.admin.users.people");
			}			
		}, 

		saveAll : function () {
			this.store.peekAll('user').forEach(userObj => {
               if(userObj.get('hasDirtyAttributes')){
                   userObj.save();
               }
           });
		}		
	}
});
