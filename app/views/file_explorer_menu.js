var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'button',
  className: "silver btn-sm file-explorer-menu",
  attributes: {
    'type' : 'button'
  },
  events: {
    'click' : 'toggleMenu'
  },
  toggleMenu: function () {
    this.$el.toggleClass('active');
    this.$('.popover').toggleClass('in');
  }
});

module.exports.id = "FileExplorerMenu";
