var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  className: 'lightbox login-modal',
  defaultHeader: "Sign in to Runnable",
  postInitialize: function (options) {
    this.header = this.options.header || this.defaultHeader;
  },
  events: _.extend(Super.events, {
    'click .signup-link' : 'openSignup',
    'submit form'        : 'login'
  }),
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  openSignup: function () {
    this.close();
    var SignupModal = require('./signup_modal');
    var signupModal = new SignupModal({ app:this.app });
    signupModal.open();
    return false; // stop link
  },
  getTemplateData: function () {
    return {
      header: this.header
    };
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
  }
});

module.exports.id = "LoginModal";
