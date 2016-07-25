var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;
var UserVerificationModal = require('./user_verification_modal');
var RestPassModal = require('./reset_pass_modal');

module.exports = ModalView.extend({
  id:'login',
  defaultHeader: "Log in to Runnable",
  postInitialize: function () {
    this.options.header = this.options.header || this.defaultHeader;
    this.onClose = this.options.onClose;
  },
  events: {
    'click .signup-link'      : 'openSignup',
    'submit form'             : 'login',
    'click .forgotpass-link'  : 'openResetPass'
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
  openResetPass: function (evt) {
    evt.preventDefault();
    this.openedResetPass = true;
    this.close();
    var resetPassModal = new RestPassModal({ app:this.app, onClose:this.onClose });
    resetPassModal.open();
  },
  login: function (evt) {
    var self = this;
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    this.app.user.login(formData.username, formData.password, function (err) {
      if (err) {
        this.showError(err);
      }
      else {
        this.close();
        self.checkUserVerification();
      }
    }.bind(this));
  },
  checkUserVerification: function(evt) {
    if(!this.app.user.isVerified()) {
      var userVerificationModal = new UserVerificationModal({ app:this.app });
      userVerificationModal.open();
    }
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
