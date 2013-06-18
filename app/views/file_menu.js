var BaseView = require('./base_view');
var _ = require('underscore');
var Super = BaseView.prototype;
var NewFileModal = require('./new_file_modal');

module.exports = BaseView.extend({
  className: 'context-menu',
  events: {
    'click .rename'      : 'rename',
    'click .delete'      : 'del',
    'click .create-file' : 'createFile',
    'click .create-dir'  : 'createDir',
    'click .download'    : 'downloadFS'
  },
  postInitialize: function () {
    $('body').append(this.$el);
    this.render();
  },
  postRender: function () {
    this.attachWindowEvents();
    this.$el.css(_.pick(this.options, 'top', 'left'));
  },
  getTemplateData: function () {
    return {
      createOnly: this.options.createOnly,
      fsJSON    : this.model.toJSON()
    };
  },
  rename: function () {
    this.trigger('rename');
  },
  del: function () {
    this.model.remove();
  },
  createFile: function () {
    var dir = this.model.isDir() ? this.model : this.model.parentDir();
    this.newFileModal = new NewFileModal({
      model: this.model
    });
  },
  createDir: function () {
    this.newFileModal = new NewFileModal({
      model: this.model
    });
  },
  remove: function () {
    this.detachWindowEvents();
    this.trigger('remove');
    Super.remove.apply(this, arguments);
  },
  attachWindowEvents: function () {
    var $window = $(window);
    this.removeBindThis = this.remove.bind(this);
    $window.one('click blur', this.removeBindThis);
    setTimeout(function () {
      $window.one('contextmenu', this.removeBindThis);
    }.bind(this), 0);
    this.windowEvents = 'click blur contextmenu';
  },
  detachWindowEvents: function () {
    $(window).off(this.windowEvents, this.removeBindThis);
  }
});

module.exports.id = "FileMenu";
