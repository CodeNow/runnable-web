var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id: 'signup',
  defaultHeader: "Sign up for Code Snippets",
  postInitialize: function () {
    this.options.header = this.options.header || this.defaultHeader;
    this.onClose = this.options.onClose;
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
    this.openedLogin = true;
    this.close();
    var LoginModal = require('./login_modal');
    var loginModal = new LoginModal({ app:this.app, onClose:this.onClose });
    loginModal.open();
  },
  register: function (evt) {
    evt.preventDefault();
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
          this.showNotification('Verification mail has been sent to your registered email.');
        }
      }.bind(this));
    }
  },
  showNotification: function (notifyMsg) {
    setTimeout( function() {
      // create the notification
      var notification = new NotificationFx({
        message : '<span class="glyphicons bullhorn"></span><span><p class="notificationMsg">' + notifyMsg + '</p></span>',
        layout : 'bar',
        effect : 'slidetop',
        ttl : 8000,
        type : 'notice' // notice, warning or error
      });
      // show the notification
      notification.show();
    }, 1000 );
  },
  showError: function (err) {
    alert(err);
  },
  remove: function () {
    if (!this.openedLogin) this.onClose && this.onClose();
    Super.remove.apply(this, arguments);
  }
});

module.exports.id = "SignupModal";
