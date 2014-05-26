var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'popover fade bottom menu',
  events: {
    'click'                      : 'stopPropagation',
    'click #new-shortcut-button' : 'openNewShortcut',
    'click label'                : 'toggleOutputViews',
    'submit form'                : 'createNewShortcut'
  },
  openNewShortcut: function (evt) {
    this.stopPropagation(evt);
    this.$el.addClass('show-new-shortcut');
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
