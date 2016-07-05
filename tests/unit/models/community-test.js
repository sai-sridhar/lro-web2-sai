import { moduleForModel, test } from 'ember-qunit';

moduleForModel('community', 'Unit | Model | community', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('full community name calculated properly', function(assert) {
	const community = this.subject({ name : "Avalon", code : "AV1234" });

	assert.equal(community.get("fullName"), "Avalon (AV1234)", "full name is calculated");
});
