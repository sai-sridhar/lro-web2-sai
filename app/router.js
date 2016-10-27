import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login', function() {
    this.route('forgotPassword');
    this.route('passwordExpired');
    this.route('passwordReset');
  });
  this.route('lro', function() {
    this.route('dashboard');
    //this.route('emberHackathon');
    this.route('emberHackathon', { path : "/emberHackathon/:user_id" });
    this.route('pricingLeasing', function() {
      this.route('community', { path : "/:community_id" }, function() {
        this.route('new', function() {
          this.route('unit', { path : "/unit/:unit_id" });
        });
        this.route('ptr');
        this.route('competitors');
        this.route('charts');
        this.route('utilities', function() {
          this.route('leaseAudit');
          this.route('leaseExplorer');
          this.route('daysOnMarket');
          this.route('rentVisualizer');
          this.route('demandOverride');
          this.route('drrcBizCase');
          this.route('drrcLeaseVelocity');
          this.route('unitsOnRent');
        });
        this.route('renewal', function() {
          this.route('unit', { path : "/:unit_id" });
        });
      });
    });
    this.route('renewals', function() {
      this.route('batches', function() {
        this.route('home', function() {
          this.route('open');
          this.route('committed');
        });
        this.route('newBatch');
        this.route('batch', { path : "/:batch_id" }, function() {
          this.route("home", function() {
            this.route('unit', { path : "/unit/:unit_id" });
            this.route('params');
            this.route('terms');
          });
          this.route('community', { path : "/community/:community_id" }, function() {
            this.route('unit', { path : "/unit/:unit_id" });
            this.route('params');
            this.route('terms');
            this.route('unitType', { path : "unitType/:unit_type" });
          });
        });
      });
      this.route('settings');
      this.route('params', function() {
        this.route('community', { path : "/community/:community_id" }, function() {
          this.route('unitType', { path : "/:unit_type" });
        });
      });
      this.route('feedback', function() {
      });
    });
    this.route('lri');
    this.route('admin', function() {
      this.route('communities', function() {
        this.route('community', { path : "/:community_id" }, function() {
          this.route('info');
          this.route('unitTypes');
          this.route('leaseTerms');
          this.route('affordable');
          this.route('quote');
          this.route('strategy');
          this.route('comments');
        });
      });
      this.route('params');
      this.route('hierarchy');
      this.route('users', function() {
        this.route('roles', function() {
          this.route('role', { path : "/:role_id" });
          this.route('newRole', { path : "/new" });
        });
        this.route('groups', function() {
          this.route('group', { path : "/:group_id" }, function() {
            this.route('users');
            this.route('properties');
            this.route('addProperty');
            this.route('addUser');
          });
          this.route('newGroup', { path : "/new" });
        });
        this.route('people', function() {
          this.route('user', { path : "/:user_id" }, function() {
            this.route('assign');
          });
          this.route('newUser', { path : "/new" });
        });
      });
      this.route('utilities');
    });
    this.route('support');
    this.route('loading');
  });  
});

export default Router;
