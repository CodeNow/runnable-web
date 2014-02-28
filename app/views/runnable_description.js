var BaseView = require('./base_view');
var Image = require('../models/image');
var utils = require('../utils');

module.exports = BaseView.extend({
  className: 'runnable-description',
  events: {
    'click .edit-link': 'clickEdit',
    'submit form'     : 'submitDescription',
    'click .btn-cancel': 'escEditMode'
  },
  postRender: function () {
    this.listenTo(this.model, 'change:description', this.render.bind(this));
  },
  getTemplateData: function () {
    this.options.canEdit = !(this.model instanceof Image) &&
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
    this.options.editMode = bool;
    this.render();
  },
  submitDescription: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    this.options.editMode = false; // assume success, change will rerender
    if (formData.description === this.model.get('description')) this.render();
    var opts = utils.cbOpts(cb, this);
    opts.patch = true;
    this.model.save(formData, opts);
    function cb (err) {
      if (err) {
        this.setEditMode(true);
        this.showError(err);
      }
    }
  }
});

module.exports.id = "RunnableDescription";
