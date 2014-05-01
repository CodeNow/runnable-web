var BaseView     = require('./base_view'),
    _            = require('underscore'),
    modalHelpers = require('../helpers/modals');

module.exports = BaseView.extend({
  tagName: 'aside',
  id: 'file-explorer',
  events: {
    'click .dark-theme'              : 'setDarkTheme',
    'click .light-theme'             : 'setLightTheme',
    'click .open-context-menu'       : 'showFileMenu',
    'click .plus'                    : 'showFileMenu',
    'contextmenu .open-context-menu' : 'showFileMenu',
    'click [data-action="download"]' : 'showDownloadDialog',
    'drop #drop-to-add'              : 'uploadToRoot',
    'dragover #drop-to-add'          : 'dragOver',
    'dragleave #drop-to-add'         : 'dragLeave',
    'click #rebuild'                 : 'rebuild'
  },
  showDownloadDialog: function () {
    modalHelpers.saveProjectMessage.call(this, function () {
    });
  },
  postRender: function () {
    this.fileRoot = _.findWhere(this.childViews, {name:'file_tree'});
    this.adjustTreeHeight();
  },
  adjustTreeHeight: function () {
    var thisHeight = this.$el.height();
    var buildHeight = this.$('#build-files').height();
    var $subTree = this.$('.sub-tree');

    if (buildHeight > thisHeight/2) {
      $subTree.css('max-height','50%');
    }
    else {
      var containerHeight = thisHeight - buildHeight;
      this.$('#container-files').height(containerHeight);
    }
  },
  showFileMenu: function (evt) {
    evt.preventDefault();
    // fragile, but I dont want to duplicate the file menu.. and it needs the rootDir
    this.fileRoot.contextMenu(evt);
  },
  setDarkTheme: function (evt) {
    if (evt) evt.preventDefault();
    this.$('.light-theme').removeClass('active');
    this.$('.dark-theme').addClass('active');
    this.app.dispatch.trigger('change:theme', 'dark');
  },
  setLightTheme: function (evt) {
    if (evt) evt.preventDefault();
    this.$('.dark-theme').removeClass('active');
    this.$('.light-theme').addClass('active');
    this.app.dispatch.trigger('change:theme', 'light');
  },
  uploadToRoot: function (evt) {
    this.stopPropagation(evt);
    this.fileRoot.uploadFiles(evt);
  },
  dragOver: function (evt) {
    this.stopPropagation(evt);
    this.$('#drop-to-add').addClass('in');
  },
  dragLeave: function (evt) {
    this.stopPropagation(evt);
    this.$('#drop-to-add').removeClass('in');
  },
  rebuild: function () {
    $('#project').addClass('out');
  },
  stopPropagation: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  },
  getTemplateData: function () {
    return this.options;
  },
  postHydrate: function () {
    $(window).resize(this.adjustTreeHeight.bind(this));
  },
  remove: function () {
    $(window).unbind('resize', this.adjustTreeHeight);
  }
});

module.exports.id = "FileExplorer";
