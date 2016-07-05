import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('renewal-batch', 'Unit | Model | renewal batch', {
  // Specify the other units that are required for this test.
  needs: ["model:renewalComm"]
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('should have many renewal communities', function(assert) {
  const m = this.store().modelFor('renewalBatch');
  const relationship = Ember.get(m, 'relationshipsByName').get('communities');

  assert.equal(relationship.key, 'communities', 'has relationship with renewal comm');
  assert.equal(relationship.kind, 'hasMany', 'kind of relationship is hasMany');
});
