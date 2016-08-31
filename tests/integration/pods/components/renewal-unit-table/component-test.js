import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('renewal-unit-table', 'Integration | Component | renewal unit table', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{renewal-unit-table}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#renewal-unit-table}}
      template block text
    {{/renewal-unit-table}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
