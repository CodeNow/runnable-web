var BaseView = require('./base_view');
var utils = require('../utils');
var Image = require('../models/image');
var _ = require('underscore');
var utils = require('../utils');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName:'span',
  events: {
    'click .edit-title': 'clickEdit',
    'submit form'      : 'submitName',
    'click .btn-cancel': 'escEditMode'
  },
  preRender: function () {
    if (!(this.model instanceof Image)) {
      this.className = 'no-padding';// if no vote button
    }
  },
  postRender: function () {
    this.listenTo(this.model, 'change:name change:tags', this.render.bind(this));
  },
  getTemplateData: function () {
    this.model.virtual.nameWithTags = this.model.nameWithTags(true);
    this.options.canedit = !(this.model instanceof Image) &&
      this.app.user.canEdit(this.model);
    return this.options;
  },
  clickEdit: function (evt) {
    evt.preventDefault();
    this.setEditMode(true);
  },
  escEditMode: function () {
    this.setEditMode(false);
  },
  setEditMode: function (bool) {
    this.options.editmode = bool;
    this.render();
  },
  submitName: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    var options = utils.cbOpts(cb, this);
    this.options.editmode = false; // assume success, change will rerender
    this.model.save(formData,  options);
    function cb (err) {
      if (err) {
        this.setEditMode(true);
        this.showError(err);
      }
    }
  }
});

module.exports.id = 'RunnableTitle';
