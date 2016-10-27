import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
		var previousRoutes = this.router.router.currentHandlerInfos;
		var previousRoute = previousRoutes && previousRoutes.pop();
		if(previousRoute) {
			localStorage["lastVisitedRoute"] = previousRoute.name;            
            console.log(previousRoute.name);
		}
  	},

    model : function(params) {
        console.log(params.user_id);
        if (params.user_id == "Sai"){
            return this.store.query("user", { firstName : "Sai" });
        } else {
            //return this.store.findRecord("user", params.user_id);
            return this.store.query("user", { firstName : params.user_id });
        }        
	}  
});
