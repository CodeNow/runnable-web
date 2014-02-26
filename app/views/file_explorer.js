var BaseView = require('./base_view');
var _ = require('underscore');
var lock = require('../lock');

var events;
if (lock) {
  events = {
    'click .dark-theme'              : 'setDarkTheme',
    'click .light-theme'             : 'setLightTheme',
    'click .open-context-menu'       : 'showFileMenu',
    'contextmenu .open-context-menu' : 'showFileMenu',
  };
}
else {
  events = {
    'click .dark-theme'              : 'setDarkTheme',
    'click .light-theme'             : 'setLightTheme',
    'click .open-context-menu'       : 'showFileMenu',
    'contextmenu .open-context-menu' : 'showFileMenu',
    'drop #drop-to-add'              : 'uploadToRoot',
    'dragover #drop-to-add'          : 'dragOver',
    'dragleave #drop-to-add'         : 'dragLeave',
  };
}

module.exports = BaseView.extend({
  tagName: 'aside',
  id: 'file-explorer',
  events: events,
  postRender: function () {
    this.fileRoot = _.findWhere(this.childViews, {name:'file_tree'});
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
  stopPropagation: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  },
  getTemplateData: function () {
    this.options.lock = lock;
    return this.options;
  }
});

module.exports.id = "FileExplorer";
