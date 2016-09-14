import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	// host : 'http://localhost:8081',
	host : "https://secret-bayou-46458.herokuapp.com",
	namespace : "api/v1"
});
