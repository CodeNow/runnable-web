var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'h1',
  events: {
    'click .edit-link': 'clickEdit',
    'click .btn-cancel': 'escEditMode',
    'submit form' : 'submitName'
  },
  postRender: function () {
    console.log('runnableId debug:', this.app.utils.base64ToHex(this.model.id));
    console.log('runnableId debug:', this.model);

    this.model.on('change', function () {
      this.render();
    }, this);
  },
  getTemplateData: function () {
    return _.extend(this.options, {
      isOwner: true //this.app.user.isOwnerOf(this.model)
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
    this.setEditMode(false);
  }
});

module.exports.id = 'RunnableTitle';
