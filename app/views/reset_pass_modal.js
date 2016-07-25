var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id:'login',
  defaultHeader: "Reset password",
  postInitialize: function () {
    this.options.header = this.options.header || this.defaultHeader;
    this.onClose = this.options.onClose;
  },
  events: {
    'click .login-link'       : 'openLogin',
    'submit form'             : 'passReset'
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
  passReset: function (evt) {
    var self = this;
    evt.preventDefault();
    var formData = $(evt.currentTarget).serializeObject();
    
    this.app.user.passResetReq(formData.username, function (err) {
      if (err) {
        this.showError(err);
      }
      else {
        this.close();
        this.showNotification('Password reset mail sent to your registerd email account.');
      }
    }.bind(this));
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
    if (!this.openedSignup) this.onClose && this.onClose();
    Super.remove.apply(this, arguments);
  }
});

module.exports.id = "ResetPassModal";
