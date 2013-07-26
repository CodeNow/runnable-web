var BaseView = require('./base_view');
var _ = require('underscore');
var FileMenu = require('./file_menu');
var NewFileModal = require('./new_file_modal');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'span',
  events: {
    'submit form' : 'submitName',
    'blur input'  : 'escEditMode',
    'click a'     : 'click'
  },
  getTemplateData: function () {
    return _.extend(this.options, this.options.model.toJSON());;
  },
  click: function () {
    if (this.model.isFile()) {
      this.app.dispatch.trigger('open:file', this.model);
    }
  },
  postHydrate: function () {
    this.listenTo(this.model, 'change:name', this.render.bind(this));
    this.listenTo(this.model, 'change:selected', this.highlightIfSelected.bind(this));
    this.listenTo(this.model, 'rename', this.setEditMode.bind(this, true));
    this.highlightIfSelected();
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
    if (this.options.editmode) {
      this.$('input').focus();
    }
    this.makeDraggable()
  },
  makeDraggable: function () {
    if (!this.model.isRootDir()) {
      this.$el.draggable({
        opacity: .8,
        helper: "clone",
        containment: "#file-tree"
      });
    }
  },
  setEditMode: function (bool) {
    this.options.editmode = bool;
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
