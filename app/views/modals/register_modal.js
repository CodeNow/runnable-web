var ModalView = require('../modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id: 'register-modal',
  events: {
    'click a#signup_link' :      'flip',
    'submit form#login_form':    'submit_login',
    'submit form#register_form': 'submit_register'
  },
  postInitialize: function () {
    this.options.header = this.options.header || this.defaultHeader;
    this.onClose = this.options.onClose;
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  remove: function () {
    if(this.onClose)
      this.onClose();
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
  show_error: function (errorMsg) {
    alert(errorMsg);
    return; //TODO
  },
  submit_login: function (evt) {
    evt.preventDefault();
    //disable button
    //this.$el.find('form#login_form button[type="submit"]').attr('disabled', 'disabled');
    var formData = $(evt.currentTarget).serializeObject();
    if (!formData.username) {
      this.show_error('Username is required');
    }
    else if (/\s/g.test(formData.username)) {
      this.show_error('Whitespace is not allowed in the username.');
    }
    else if (!formData.email) {
      this.show_error('Email is required');
    }
    else if (!formData.password) {
      this.show_error('Password is required');
    }
    else {
      this.app.user.register(formData.email, formData.username, formData.password, function (err) {
        if (err) {
          this.show_error(err);
        }
        else {
          this.close();
        }
      }.bind(this));
    }
  },
  submit_register: function (evt) {
    evt.preventDefault();

  }
});

module.exports.id = "modals/registerModal";
