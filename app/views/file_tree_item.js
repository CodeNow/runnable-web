var BaseView = require('./base_view');
var _ = require('underscore');
// var FileMenu = require('./file_menu');
// var NewFileModal = require('./new_file_modal');
var utils = require('../utils');
var closedClass = 'collapsed';

module.exports = BaseView.extend({
  events: {
    'submit form' : 'submitName',
    'blur input'  : 'escEditMode',
    'click'       : 'click'
  },
  preRender: function () {
    var opts = this.options;
    var model = opts.model;

    if (model.isRootDir()) {
      this.attributes = {};
      this.attributes.style = 'display:none;';
    }
    else if (opts.editmode) {
      this.tagName = 'form';
      this.events.submit = 'submitName';
      this.events.click = undefined;
    }
    else {
      this.tagName = 'a';
      this.className = 'collapsed';
      this.events.submit = undefined;
      this.events.click = 'click';
      this.attributes = {
        href      : 'javascript:void(0);',
        'data-id' : opts.model.id
      };
    }
  },
  getTemplateData: function () {
    var opts = this.options;
    var model = opts.model;
    var className = '';
    var isDir = model.isDir();
    model.virtual.isDir = isDir;
    if (isDir && !model.get('open')) className = 'collapsed';
    return _.extend(opts, { className:className });
  },
  click: function (evt) {
    if (this.model.isFile()) {
      evt.preventDefault();
      this.app.dispatch.trigger('open:file', this.model);
    }
    else { // isDir
      var animating = this.$el.next().hasClass('animating');
      if (animating) return;

      if (this.model.get('open')) {
        this.$el.addClass('collapsed');
        this.model.set('open', false);
      }
      else {
        this.$el.removeClass('collapsed');
        this.model.set('open', true);
      }
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
      this.$el.parent().addClass('active');
    }
    else {
      this.$el.parent().removeClass('active');
    }
  },
  postRender: function () {
    this.highlightIfSelected();
    if (this.options.editmode) {
      this.$('input').focus();
    }
    this.makeDraggable();
    if (this.options.model.isRootDir()) {
      this.remove();
    }
  },
  makeDraggable: function () {
    if (!this.model.isRootDir()) {
      this.$el.draggable({
        opacity: 0.8,
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
