import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('lease-term', 'Unit | Model | lease term', {
  // Specify the other units that are required for this test.
  needs: ["model:newPricing"]
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('should belong to a new pricing', function(assert) {
  const lt = this.store().modelFor('leaseTerm');
  const relationship = Ember.get(lt, 'relationshipsByName').get('newPricing');

  assert.equal(relationship.key, 'newPricing', 'has relationship with newPricing');
  assert.equal(relationship.kind, 'belongsTo', 'kind of relationship is belongsTo');
});

