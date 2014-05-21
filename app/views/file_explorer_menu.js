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
    'click .popover'       : 'stopPropagation',
    'click #add-repo-link' : 'addRepo',
    'click .select-branch' : 'toggleRepoForm'
  },
  togglePopover: function (evt) {
    var $self = this.$el;
    var $popover = this.$('.popover');
    var $addRepo = this.$('#add-repo')

    this.stopPropagation(evt);

    if ($self.hasClass('active')) {
      $self.removeClass('active');
      $popover.removeClass('show-add-repo show-form');
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
  toggleRepoForm: function (evt) {
    var $repoList = this.$('#add-repo').find('li');
    var $currentTarget = this.$(evt.currentTarget).closest('li');
    var $popover = this.$('.popover');

    if ($popover.hasClass('show-form')) {
      $repoList.removeClass('in');
      $popover.removeClass('show-form');
    }
    else {
      // $addRepoItem.removeClass('show-form');
      $currentTarget.addClass('in');
      $popover.addClass('show-form');
    }
  },
  stopPropagation: function (evt) {
    evt.stopPropagation();
  }
});

module.exports.id = "FileExplorerMenu";
