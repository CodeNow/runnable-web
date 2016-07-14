var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id: 'signup',
  defaultHeader: "Change Password",
  postInitialize: function () {
    this.options.header = this.options.header || this.defaultHeader;
    this.onClose = this.options.onClose;
  },
  events: {
    'submit form'      : 'changePass'
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  changePass: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    if (!formData.password) {
      this.showError('Existing Password is required');
    }
    else if (!formData.passwordNew) {
      this.showError('New Password is required');
    }
    else 
    {
      this.app.user.changePass(formData.password, formData.passwordNew, function (err) {
        if (err) {
          this.showError(err);
        }
        else {
          this.close();
        }
      }.bind(this));
    }
  },
  showError: function (err) {
    alert(err);
  },
  remove: function () {
    if (!this.openedLogin) this.onClose && this.onClose();
    Super.remove.apply(this, arguments);
  }
});

module.exports.id = "ChangePassModal";
