import Ember from 'ember';
import RoundingMixin from '../../../mixins/rounding';
import { module, test } from 'qunit';

module('Unit | Mixin | rounding');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoundingObject = Ember.Object.extend(RoundingMixin);
  let subject = RoundingObject.create();
  assert.ok(subject);
});
