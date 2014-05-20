var BaseView = require('./base_view');
var GitModal = require('./modals/git_connect_modal');

module.exports = BaseView.extend({
  tagName: 'button',
  className: "silver btn-sm file-explorer-menu",
  attributes: {
    'type' : 'button'
  },
  events: {
    'click'                : 'togglePopover',
    'click #add-repo-link' : 'addRepo'
  },
  togglePopover: function () {
    var $self = this.$el;
    var $popover = this.$('.popover');

    if ($self.hasClass('active')) {
      $self.removeClass('active');
      $popover.removeClass('show-add-repo');
    }
    else {
      $self.addClass('active');
      $popover.addClass('in');
    }
  },
  addRepo: function (evt) {
    evt.stopPropagation();

    var $popover = this.$('.popover');
    var gitConnected = true; // warning: pseudo code

    if (!gitConnected) {
      var gitModal = new GitModal({ app:this.app });
      gitModal.open();
    }
    else {
      $popover.addClass('show-add-repo');
    }
  }
});

module.exports.id = "FileExplorerMenu";
