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
    'click .select-branch' : 'toggleRepoForm'
  },
  hideRepoPopover: function () {
    $('.file-explorer-menu').removeClass('active');
    $('.popover').removeClass('show-add-repo show-form in');
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
      this.hideRepoPopover();

      // unbind when popover is closed
      $body.off('click', this.hideRepoPopover);
    }
    else {
      $self.addClass('active');
      $popover.addClass('in');

      // bind when popover is open
      $body.on('click',{thisView : this}, this.hideRepoPopover);
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
