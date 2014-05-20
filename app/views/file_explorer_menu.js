var BaseView = require('./base_view');
var GitModal = require('./modals/git_connect_modal');

module.exports = BaseView.extend({
  tagName: 'button',
  className: "silver btn-sm file-explorer-menu",
  attributes: {
    'type' : 'button'
  },
  events: {
    'click' : 'toggleMenu',
    'click a' : 'addRepo'
  },
  toggleMenu: function () {
    this.$el.toggleClass('active');
    this.$('.popover').toggleClass('in');
  },
  addRepo: function (evt) {
    evt.stopPropagation();

    // warning: pseudo code
    // if (!gitConnected) {
      var gitModal = new GitModal({ app:this.app });
      gitModal.open();
    // }
  }
});

module.exports.id = "FileExplorerMenu";
