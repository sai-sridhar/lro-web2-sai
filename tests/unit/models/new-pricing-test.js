import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('new-pricing', 'Unit | Model | new pricing', {
  // Specify the other units that are required for this test.
  needs: ["model:community", "model:leaseTerm"]
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('should belong to a community', function(assert) {
  const m = this.store().modelFor('newPricing');
  const relationship = Ember.get(m, 'relationshipsByName').get('community');

  assert.equal(relationship.key, 'community', 'has relationship with community');
  assert.equal(relationship.kind, 'belongsTo', 'kind of relationship is belongsTo');
});

test('should have many lease terms', function(assert) {
  const m = this.store().modelFor('newPricing');
  const relationship = Ember.get(m, 'relationshipsByName').get('leaseTerms');

  assert.equal(relationship.key, 'leaseTerms', 'has relationship with lease terms');
  assert.equal(relationship.kind, 'hasMany', 'kind of relationship is hasMany');
});

