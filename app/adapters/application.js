import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	// shouldReloadRecord: function() { return true; },
 //  	shouldReloadAll: function() { return true; },
 //  	shouldBackgroundReloadRecord: function() { return true; },
 //  	shouldBackgroundReloadAll: function() { return true; },

	// host : 'http://localhost:8081',
	host : "https://secret-bayou-46458.herokuapp.com",
	namespace : "api/v1"
});
