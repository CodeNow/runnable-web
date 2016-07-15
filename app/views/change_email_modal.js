var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id: 'changeEmail',
  defaultHeader: "Change Email",
  postInitialize: function () {
    this.options.header = this.options.header || this.defaultHeader;
    this.onClose = this.options.onClose;
  },
  events: {
    'submit form'      : 'changeEmail'
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  changeEmail: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    if (!formData.emailNew) {
      this.showError('New Email is required');
    }
    else if (/\s/g.test(formData.emailNew)) {
      this.showError('Whitespace is not allowed in the email.');
    }
    else 
    {
      this.app.user.changeEmailReq(formData.emailNew, function (err) {
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

module.exports.id = "ChangeEmailModal";
