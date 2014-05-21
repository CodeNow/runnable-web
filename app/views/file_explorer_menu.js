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
    'click #add-repo-link' : 'addRepo',
    'click .cogwheel'      : 'showRepoForm'
  },
  togglePopover: function (evt) {
    var $self = this.$el;
    var $popover = this.$('.popover');

    this.stopPropagation(evt);

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
    this.stopPropagation(evt);

    var $popover = this.$('.popover');
    var gitConnected = true; // warning: pseudo code

    if (!gitConnected) {
      var gitModal = new GitModal({ app:this.app });
      gitModal.open();
    }
    else {
      $popover.addClass('show-add-repo');
    }
  },
  showRepoForm: function (evt) {
    this.$(evt.currentTarget)
      .closest('li')
      .addClass('show-form');

  },
  stopPropagation: function (evt) {
    evt.stopPropagation();
  }
});

module.exports.id = "FileExplorerMenu";
