var BaseView = require('./base_view');
var _ = require('underscore');
var FileMenu = require('./file_menu');

module.exports = BaseView.extend({
  tagName: 'span',
  events: {
    'contextmenu' : 'showMenu',
    'submit form' : 'submitName',
    'blur input'  : 'escEditMode',
    'click a' : 'selectFile'
  },
  getTemplateData: function () {
    return {
      model: this.options.model
    }
  }
  // selectFile: function () {
  //   this.path = this.options.path || '/';
  //   this.fs = this.model.rootDir.getPath(this.path)
  //   this.model.openFiles.add(this.fs);
  //   this.model.openFiles.selectedFile(this.path);
  //   return false;
  // },
  // postHydrate: function () {
  //   // clientside
  //   // postHydrate is the place to attach data events
  //   // this.path = this.options.path || '/';
  //   // this.fs = this.model.rootDir.getPath(this.path);
  //   // this.listenTo(this.fs, 'change', this.render.bind(this));
  //   // this.listenTo(this.model.openFiles, 'select:file', this.highlightSelected.bind(this));
  // },
  // highlightSelected: function (selectedFile) {
  //   if (this.fs == selectedFile) {
  //     this.$el.parent().addClass('selected');
  //   }
  //   else {
  //     this.$el.parent().removeClass('selected');
  //   }
  // },
  // postRender: function () {
  //   if (this.editMode) {
  //     this.$('input').focus();
  //   }
  //   if (!this.fs.isRootDir()) {
  //     this.$el.draggable({
  //       opacity: .8,
  //       helper: "clone",
  //       containment: "#file-tree"
  //     });
  //   }
  // },
  // showMenu: function (evt) {
  //   if (this.menu) {
  //     this.menu.remove();
  //     this.menu = null;
  //   }
  //   evt.preventDefault();
  //   var menu = this.menu = new FileMenu({
  //     model: this.fs,
  //     top  : evt.pageY,
  //     left : evt.pageX
  //   });
  //   this.listenToOnce(menu, 'rename', this.setEditMode.bind(this, true));
  //   this.listenToOnce(menu, 'remove', this.stopListening.bind(this, menu));
  // },
  // setEditMode: function (bool) {
  //   this.editMode = bool;
  //   this.render();
  // },
  // escEditMode: function () {
  //   this.setEditMode(false);
  // },
  // submitName: function (evt) {
  //   evt.preventDefault();
  //   var formData = $(evt.currentTarget).serializeObject();
  //   this.fs.rename(formData.name, function (err) {
  //     if (err) {
  //       this.showError(err);
  //     }
  //     else {
  //       this.escEditMode();
  //     }
  //   }.bind(this));
  // },
  // showError: function (err) {
  //   if (err) {
  //     alert(err);
  //   }
  // }
});

module.exports.id = "FileTreeItem";
