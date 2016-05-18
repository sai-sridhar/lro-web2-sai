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
      });
    });
    this.route('renewals', function() {
      this.route('batches', function() {
        this.route('open');
        this.route('committed');
        this.route('newBatch');
      });
      this.route('batch', { path : "/batch/:batch_id" }, function() {
        this.route('community', { path : "/community/:community_id" }, function() {
          this.route('unit', { path : "/unit/:unit_id" });
        });
        this.route("home", function() {
          this.route('unit', { path : "/unit/:unit_id" });
          this.route('params');
          this.route('terms');
        });
      });
      this.route('settings');
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
      this.route('users');
      this.route('utilities');
    });
    this.route('support');
  });

});

export default Router;
