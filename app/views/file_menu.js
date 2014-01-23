var BaseView = require('./base_view');
var _ = require('underscore');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'context-menu',
  events: {
    'click .rename'      : 'rename',
    'click .delete-all'  : 'delAll',
    'click .delete'      : 'del',
    'click .default'     : 'default',
    'click .undefault'   : 'undefault',
    'click .create-file' : 'createFile',
    'click .create-dir'  : 'createDir',
    'click .upload'      : 'upload',
    'click .download'    : 'download'
  },
  postInitialize: function () {
    $('body').append(this.$el);
    this.render();
  },
  postRender: function () {
    // settimeout bc render is triggered by a click event which is still propagating dom
    // settimeout ensures the window events are set after the evt propagation has completed
    setTimeout(this.attachWindowEvents.bind(this), 0);
    this.$el.css(_.pick(this.options, 'top', 'left'));
  },
  getTemplateData: function () {
    return _.extend(this.options, {
      isFile: this.model.isFile()
    });
  },
  rename: function () {
    this.trigger('rename');
  },
  del: function () {
    this.trigger('delete');
  },
  delAll: function () {
    this.trigger('deleteAll');
  },
  default: function () {
    this.trigger('default');
  },
  undefault: function () {
    this.trigger('undefault');
  },
  createFile: function () {
    this.trigger('create', 'file');
  },
  createDir: function () {
    this.trigger('create', 'folder');
  },
  upload: function () {
    this.trigger('upload');
  },
  download: function () {
    this.alert('TODO');
  },
  remove: function (evt) {
    this.detachWindowEvents();
    this.trigger('remove');
    Super.remove.apply(this, arguments);
  },
  attachWindowEvents: function () {
    var $window = $(window);
    this.removeBindThis = this.remove.bind(this);
    $window.one('click blur', this.removeBindThis);
    $window.one('contextmenu', this.removeBindThis);
    this.windowEvents = 'click blur contextmenu';
  },
  detachWindowEvents: function () {
    $(window).off(this.windowEvents, this.removeBindThis);
  }
});

module.exports.id = "FileMenu";
