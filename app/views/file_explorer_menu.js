var BaseView = require('./base_view');
var GitModal = require('./modals/git_connect_modal');

module.exports = BaseView.extend({
  tagName: 'button',
  className: "silver btn-sm btn-popover file-explorer-menu",
  attributes: {
    'type' : 'button'
  },
  events: {
    'click'                : 'togglePopover',
    'click .popover'       : 'stopPropagation',
    'click #add-repo-link' : 'addRepo',
    'click .select-repo'   : 'toggleRepoForm'
  },
  hidePopover: function () {
    $('.btn-popover').removeClass('active');
    $('.popover').removeClass('show-add-repo show-form show-new-shortcut in');

    // unbind when popover is closed
    $('body').off('click', this.hidePopover);
  },
  togglePopover: function (evt) {
    var $body = $('body');
    var $self = this.$el;
    var $popover = this.$('.popover');
    var $addRepo = this.$('#add-repo')

    this.stopPropagation(evt);

    $('.popover').removeClass('in');

    if ($self.hasClass('active')) {
      $('.btn-popover').removeClass('active');
      this.hidePopover();

      // unbind when popover is closed
      $body.off('click', this.hidePopover);
    }
    else {
      this.hidePopover();
      $self.addClass('active');
      $popover.addClass('in');

      // bind when popover is open
      $body.on('click',{thisView : this}, this.hidePopover);
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
  toggleRepoForm: function (evt) {
    var $repoList = this.$('#add-repo').find('li');
    var $currentTarget = this.$(evt.currentTarget).closest('li');
    var $popover = this.$('.popover');

    if ($popover.hasClass('show-form')) {
      $repoList.removeClass('in');
      $popover.removeClass('show-form');
    }
    else {
      $currentTarget.addClass('in');
      $popover.addClass('show-form');
    }
  },
  stopPropagation: function (evt) {
    evt.stopPropagation();
  }
});

module.exports.id = "FileExplorerMenu";
