var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'popover fade bottom',
  events: {
    'click li:last-child' : 'openShortcuts',
    'click .silver'       : 'openNewShortcut',
    'submit form'         : 'createNewShortcut'
  },
  openShortcuts: function (evt) {
    this.preventDefault(evt);
    this.$el
      .removeClass('show-new-shortcut')
      .addClass('show-shortcuts');
  },
  openNewShortcut: function (evt) {
    this.preventDefault(evt);
    this.$el
      .removeClass('show-shortcuts')
      .addClass('show-new-shortcut');
  },
  createNewShortcut: function (evt) {
    this.preventDefault(evt);
  },
  preventDefault: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
});

module.exports.id = "AddTabPopover";
