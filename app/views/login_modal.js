var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id:'login',
  className: 'fade',
  defaultHeader: "Log in to Runnable",
  postInitialize: function () {
    this.options.header = this.options.header || this.defaultHeader;
    this.onClose = this.options.onClose;
  },
  events: {
    'click .signup-link' : 'openSignup',
    'submit form'        : 'login'
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  openSignup: function (evt) {
    evt.preventDefault();
    this.openedSignup = true;
    this.close();
    var SignupModal = require('./signup_modal');
    var signupModal = new SignupModal({ app:this.app, onClose:this.onClose });
    signupModal.open();
  },
  login: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    this.app.user.login(formData.username, formData.password, function (err) {
      if (err) {
        this.showError(err);
      }
      else {
        this.close();
      }
    }.bind(this));
  },
  showError: function (err) {
    alert(err);
  },
  remove: function () {
    if (!this.openedSignup) this.onClose && this.onClose();
    Super.remove.apply(this, arguments);
  }
});

module.exports.id = "LoginModal";
