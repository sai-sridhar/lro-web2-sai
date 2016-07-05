import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default OAuth2PasswordGrant.extend({
	serverTokenEndpoint: 'https://secret-bayou-46458.herokuapp.com/api/v1/token'
	// serverTokenEndpoint: 'http://localhost:8081/api/v1/token'
});
