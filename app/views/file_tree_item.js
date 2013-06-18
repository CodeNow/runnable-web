var BaseView = require('./base_view');
var _ = require('underscore');
var FileMenu = require('./file_menu');

module.exports = BaseView.extend({
  tagName: 'span',
  events: {
    'contextmenu' : 'showMenu',
    'submit form' : 'submitName',
    'blur input'  : 'escEditMode'
  },
  postHydrate: function () {
    // clientside
    // postHydrate is the place to attach data events
    this.path = this.options.path || '/';
    this.fs = this.model.rootDir.getPath(this.path);
    this.listenTo(this.fs, 'change', this.render.bind(this));
  },
  getTemplateData: function () {
    // be careful postHydrate has only been called before frontend render but not backend!
    // this means, the only data you can rely on is this.model and this.options binded to this view.
    if (!this.fs) {
      this.path = this.options.path || '/';
      this.fs = this.model.rootDir.getPath(this.path);
    }
    return {
      fsJSON: this.fs.toJSON(),
      projectJSON: this.model.toJSON(),
      editMode: this.editMode
    };
  },
  postRender: function () {
    if (this.editMode) {
      this.$('input').focus();
    }
    if (!this.fs.isRootDir()) {
      this.$el.draggable({
        opacity: 0.7,
        helper: "clone",
        containment: "#file-tree"
      });
    }
  },
  showMenu: function (evt) {
    if (this.menu) {
      this.menu.remove();
      this.menu = null;
    }
    evt.preventDefault();
    var menu = this.menu = new FileMenu({
      model: this.fs,
      top  : evt.pageY,
      left : evt.pageX
    });
    this.listenToOnce(menu, 'rename', this.setEditMode.bind(this, true));
    this.listenToOnce(menu, 'remove', this.stopListening.bind(this, menu));
  },
  setEditMode: function (bool) {
    this.editMode = bool;
    this.render();
  },
  escEditMode: function () {
    this.setEditMode(false);
  },
  submitName: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    this.fs.rename(formData.name, function (err) {
      debugger;
      if (err) {
        this.showError(err);
      }
      else {
        this.escEditMode();
      }
    }.bind(this));
  },
  showError: function (err) {
    if (err) {
      alert(err);
    }
  }
});

module.exports.id = "FileTreeItem";
