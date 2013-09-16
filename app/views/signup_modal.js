var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  className: 'fade',
  defaultHeader: "Sign up for Runnable",
  postInitialize: function (options) {
    this.options.header = this.options.header || this.defaultHeader;
  },
  events: {
    'click .login-link': 'openLogin',
    'submit form'      : 'register'
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  openLogin: function (evt) {
    evt.preventDefault();
    this.close();
    var LoginModal = require('./login_modal');
    var loginModal = new LoginModal({ app:this.app });
    loginModal.open();
  },
  register: function (evt) {
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    if (!formData.username) {
      this.showError('Username is required');
    }
    else if (!formData.email) {
      this.showError('Email is required');
    }
    else if (!formData.password) {
      this.showError('Password is required');
    }
    else {
      this.app.user.register(formData.email, formData.username, formData.password, function (err) {
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
  }
});

module.exports.id = "SignupModal";
