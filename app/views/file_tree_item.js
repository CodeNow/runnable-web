var BaseView = require('./base_view');
var _ = require('underscore');
// var FileMenu = require('./file_menu');
// var NewFileModal = require('./new_file_modal');
var utils = require('../utils');
var closedClass = 'collapsed';

module.exports = BaseView.extend({
  events: {
    // editmode events
    'submit form' : 'submitName',
    'blur input'  : 'escEditMode',
    'keyup input' : 'keyup',
  },
  dontTrackEvents: ['keyup input'],
  preRender: function () {
    var opts = this.options;
    var model = opts.model;
    if (model.isRootDir()) {
      this.attributes = {};
      this.attributes.style = 'display:none;';
    }
  },
  postHydrate: function () {
    this.listenTo(this.model, 'change:selected', this.highlightIfSelected.bind(this));
    this.listenTo(this.model, 'rename', this.setEditMode.bind(this, true));
  },
  postRender: function () {
    if (this.options.model.isRootDir()) {
      this.remove();
    }
    if (this.options.editmode) {
      this.$('input').focus();
    }
    else {
      this.highlightIfSelected();
    }
  },
  highlightIfSelected: function () {
    if (this.model.isFile() && this.model.selected()) {
      this.$el.parent().addClass('active');
    }
    else {
      this.$el.parent().removeClass('active');
    }
  },
  setEditMode: function (bool) {
    this.options.editmode = bool;
    this.render();
  },
  keyup: function (evt) {
    if (evt.keyCode === 27) this.escEditMode();   // esc
  },
  escEditMode: function () {
    this.setEditMode(false);
  },
  submitName: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    var options = utils.cbOpts(function (err) {
      if (err) {
        this.showError(err);
      }
      else {
        this.escEditMode();
      }
    }, this);
    options.patch = true;
    this.model.save(formData, options);
  }
});

module.exports.id = "FileTreeItem";
