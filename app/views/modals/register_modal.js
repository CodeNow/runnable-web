var ModalView = require('../modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id: 'register-modal',
  events: {
    'click .flip-link'              : 'flip',
    'submit #login-form'            : 'submitLogin',
    'submit #signup-form'           : 'submitRegister'
  },
  postInitialize: function () {
    this.options.header = this.options.header || this.defaultHeader;
    this.onClose = this.options.onClose;
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  remove: function () {
    if (this.onClose) {
      this.onClose();
    }
    Super.remove.apply(this, arguments);
  },
  flip: function () {
    var $self = this.$el;
    var $signUp = this.$('#signup');
    var $login = this.$('#login');

    if ($self.hasClass('flip')) {
      $signUp.find('input')[0].focus();
    }
    else {
      $login.find('input')[0].focus();
    }
    $self.toggleClass('flip');
  },
  showError: function (errorMsg) {
    alert(errorMsg);
    return; //TODO
  },
  submitLogin: function (evt) {
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
  submitRegister: function (evt) {
    evt.preventDefault();
    //disable button
    //this.$el.find('form#login_form button[type="submit"]').attr('disabled', 'disabled');
    var formData = $(evt.currentTarget).serializeObject();
    if (!formData.username) {
      this.showError('Username is required');
    }
    else if (/\s/g.test(formData.username)) {
      this.showError('Whitespace is not allowed in the username.');
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
  github: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var $el = $(evt.currentTarget);
    window.location.href = $el.attr('href');
  }
});

module.exports.id = "modals/registerModal";
