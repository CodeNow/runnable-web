var BaseView = require('./base_view');
var utils = require('../utils');
var Image = require('../models/image');
var _ = require('underscore');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'div',
  events: {
    'click .edit-link': 'clickEdit',
    'submit form'      : 'submitName',
    'click .btn-cancel': 'escEditMode'
  },
  postRender: function () {
    console.log('runnableId debug:', this.app.utils.base64ToHex(this.model.id));
    console.log('runnableId debug:', this.model);

    this.model.on('change', function () {
      this.render();
    }, this);
  },
  getTemplateData: function () {
    var user = this.app.user;
    var noEdit = (this.model instanceof Image); // for now never show edit button for image
    return _.extend(this.options, {
      isOwner: !noEdit && user.isOwnerOf(this.model)
    });
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
  submitName: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var formData = $(evt.currentTarget).serializeObject();
    var options = utils.successErrorToCB(function (err) {
      if (err) {
        this.showError(err);
        this.setEditMode(true); //reverts back to edit mode
        this.setTimeout(function () {
          // after render
          this.$('.title-input').val(formData.name);
        }.bind(this), 3);
      }
    }.bind(this));
    this.model.save(formData,  options);
    var self = this;
    setTimeout(function () {
      self.setEditMode(false);
    }, 10);
  }
});

module.exports.id = 'RunnableTitle';
