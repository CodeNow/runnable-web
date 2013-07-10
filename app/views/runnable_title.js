var BaseView = require('./base_view');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'h1',
  events: {
    'click': 'click'
  },
  postRender: function () {
    console.log('runnableId debug:', this.app.utils.base64ToHex(this.model.id));
    this.model.on('change', function () {
      this.render();
    }, this);
  },
  getTemplateData: function () {
    return {
      runnable : this.model.toJSON(),
      editMode: this.editMode
    };
  },
  toggleEditMode: function () {
    this.editMode = !Boolean(this.editMode);
    return this.render();
  },
  submitName: function (evt) {
    var $form = $(evt.currentTarget);
    var formData = $form.serializeObject;
    var runnable = this.model;
    runnable.saveAttribute('name', formData.name, {
      success : function () {},
      error   : function () {}
    });
  }
});

module.exports.id = 'RunnableTitle';
