var ModalView = require('./modal_view');

module.exports = ModalView.extend({
  className: 'lightbox',
  events: {
    'click .btn-cancel' : this.remove,
    'click .btn-close'  : this.remove,
    'submit form'      : this.submitNewFile
  },
  postInitialize: function () {
    $('body').append(this.$el);
    this.render();
  },
  getTemplateData: function () {
    return this.model.toJSON();
  },
  remove: function () {
    this.trigger('remove');
    debugger;
    Super.remove.apply(this, arguments);
  },
  submitNewFile: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget);
    var err = this.model.validate(formData);
    if (err) {
      // show err
      alert(err);
    }
    else {
      var cb = this.saveCallback.bind(this);
      this.model.save(formData, this.app.utils.successErrorToCB(cb));
      this.remove();
    }
  },
  saveCallback: function (err) {
    if (err) {
      alert(err.message);
    }
    else {
      this.remove();
    }
  }
});

module.exports.id = "NewFileModal";
