var BaseView = require('./base_view');
var utils = require('../utils');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'h1',
  events: {
    'click .edit-link': 'editClicked',
    'submit form' : 'submitName'
  },
  postInitialize: function () {
    this._editMode = this.options.editMode;
  },
  editClicked: function () {
    console.log('hey')
    this.editMode(true);
  },
  postRender: function () {
    console.log('runnableId debug:', this.app.utils.base64ToHex(this.model.id));
    console.log('runnableId debug:', this.model);

    this.model.on('change', function () {
      this.render();
    }, this);
  },
  getTemplateData: function () {
    return {
      runnable : this.model.toJSON(),
      editMode: this.editMode(),
      isOwner: true//this.app.user.isOwnerOf(this.model)
    };
  },
  editMode: function (bool) {
    if (utils.exists(bool)) {
      this._editMode = bool;
      // this.render();
    }
    else {
      return this._editMode;
    }
  },
  submitName: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    var options = utils.successErrorToCB(function (err) {
      if (err) {
        this.editMode(true);
        this.showError(err);
      }
      else {
        this.editMode(false);
      }
    }.bind(this));
    this.model.save(formData,  options);
  }
});

module.exports.id = 'RunnableTitle';
