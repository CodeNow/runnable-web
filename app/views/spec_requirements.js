var BaseView = require('./base_view');

module.exports = BaseView.extend({

  events:  {
    'keyup [name=requirement]' : 'addKeyIfEnter',
    'click .add-key'    : 'addKey',
    'click .remove-key' : 'removeKey'
  },
  addKeyIfEnter: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    if (evt.keycode === 13) {
      this.addKey(evt);
    }
  },
  addKey: function (evt) {
    var $newRow = this.$('.template').clone();
    $newRow.removeClass('template');
    $newRow.removeClass('hide')
    this.$('.add-key').before($newRow);
  },
  removeKey: function (evt) {
    $(evt.currentTarget).parents('.added-key').find('input').remove();
  },
});

module.exports.id = "SpecRequirements";
