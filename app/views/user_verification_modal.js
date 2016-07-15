var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id: 'signup',
  defaultHeader: "Verify Your Email Address",
  postInitialize: function () {
    this.options.header = this.options.header || this.defaultHeader;
    this.onClose = this.options.onClose;
  },
  events: {
    'click #send-verifiymail-btn': 'sendVerifyMail',
  },
  sendVerifyMail: function() {
    var user = this.app.user;
    this.app.user.sendVerificationMail( function (err) {
        if (err) {
          this.showError(err);
        }
        else {
          this.close();
        }
      }.bind(this));
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  showError: function (err) {
    alert(err);
  },
  remove: function () {
    if (!this.openedLogin) this.onClose && this.onClose();
    Super.remove.apply(this, arguments);
  }
});

module.exports.id = "UserVerificationModal";
