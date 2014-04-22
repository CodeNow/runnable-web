var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'popover fade bottom',
  events: {
    'click .redo' : 'openShortcuts'
  },
  openShortcuts: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.$el.addClass('show-shortcuts');
  }
});

module.exports.id = "AddTabPopover";
