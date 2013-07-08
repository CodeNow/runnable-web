var BaseView = require('./base_view');
var _ = require('underscore');
var FileMenu = require('./file_menu');
var NewFileModal = require('./new_file_modal');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'span',
  events: {
    'contextmenu' : 'showMenu',
    'submit form' : 'submitName',
    'blur input'  : 'escEditMode',
    'click a'     : 'selectFile'
  },
  getTemplateData: function () {
    return this.options;
  },
  selectFile: function () {
    if (this.model.isFile()) {
      this.app.dispatch.trigger('open:file', this.model);
    }
  },
  showMenu: function (evt) {
    evt.preventDefault(); // prevent browser context menu
    if (this.menu) {
      this.menu.remove();
      this.menu = null;
    }
    var menu = this.menu = new FileMenu({
      model: this.model,
      top  : evt.pageY,
      left : evt.pageX,
      app:this.app
    });
    this.listenToOnce(menu, 'rename', this.setEditMode.bind(this, true));
    this.listenToOnce(menu, 'delete', this.destroyModel.bind(this, true));
    this.listenToOnce(menu, 'create', this.create.bind(this));
    this.listenToOnce(menu, 'remove', this.stopListening.bind(this, menu));
  },
  destroyModel: function () {
    var options = utils.successErrorToCB(function (err) {
      if (err) this.showError(err);
    }.bind(this));
    this.model.destroy();
  },
  create: function (type) {
    var collection = this.model.collection || this.parentView.collection;
    this.newFileModal = new NewFileModal({
      collection : collection,
      type: type,
      app:this.app
    });
  },
  postHydrate: function () {
    this.listenTo(this.model, 'change:name', this.render.bind(this));
    this.listenTo(this.model, 'change:selected', this.highlightIfSelected.bind(this));
  },
  highlightIfSelected: function () {
    if (this.model.get('selected')) {
      this.$el.parent().addClass('selected');
    }
    else {
      this.$el.parent().removeClass('selected');
    }
  },
  postRender: function () {
    this.highlightIfSelected();
    if (this.editMode) {
      this.$('input').focus();
    }
    // if (!this.fs.isRootDir()) {
    //   this.$el.draggable({
    //     opacity: .8,
    //     helper: "clone",
    //     containment: "#file-tree"
    //   });
    // }
  },
  setEditMode: function (bool) {
    this.options.editMode = bool;
    this.render();
  },
  escEditMode: function () {
    this.setEditMode(false);
  },
  submitName: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    var options = utils.successErrorToCB(function (err) {
      if (err) {
        this.showError(err);
      }
      else {
        this.escEditMode();
      }
    }.bind(this));
    options.patch = true;
    this.model.save(formData, options);
  },
  showError: function (err) {
    if (err) {
      alert(err);
    }
  }
});

module.exports.id = "FileTreeItem";
