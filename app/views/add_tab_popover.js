var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'popover fade bottom',
  events: {
    'click'                      : 'stopPropagation',
    'click #shortcut'            : 'openShortcuts',
    'click #new-shortcut-button' : 'openNewShortcut',
    'click label'                : 'toggleOutputViews',
    'submit form'                : 'createNewShortcut'
  },
  openShortcuts: function (evt) {
    this.stopPropagation(evt);
    this.$el
      .removeClass('show-new-shortcut')
      .addClass('show-shortcuts');
  },
  openNewShortcut: function (evt) {
    this.stopPropagation(evt);
    this.$el
      .removeClass('show-shortcuts')
      .addClass('show-new-shortcut');
  },
  createNewShortcut: function (evt) {
    this.stopPropagation(evt);
  },
  toggleOutputViews: function (evt) {
    this.$('label').removeClass('active');
    $(evt.currentTarget).addClass('active');
  },
  stopPropagation: function (evt) {
    evt.stopPropagation();
  }
});

module.exports.id = "AddTabPopover";
