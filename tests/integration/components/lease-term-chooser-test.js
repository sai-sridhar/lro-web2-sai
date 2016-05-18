import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('lease-term-chooser', 'Integration | Component | lease term chooser', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{lease-term-chooser}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#lease-term-chooser}}
      template block text
    {{/lease-term-chooser}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
