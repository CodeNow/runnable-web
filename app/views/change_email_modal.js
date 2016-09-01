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
          this.showNotification('Confirmation mail has been sent to your new mail.');
          this.close();
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

module.exports.id = "ChangeEmailModal";
