var ModalView = require('./modal_view');
var _ = require('underscore');
var utils = require('../utils');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id:'setpass',
  defaultHeader: "Set new password",
  postInitialize: function () {
    this.options.header = this.options.header || this.defaultHeader;
    this.onClose = this.options.onClose;
  },
  events: {
    'submit form'             : 'setPass'
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  setPass: function (evt) {
    var self = this;
    evt.preventDefault();
    var username = utils.getQueryParam(this.app, 'username');
    var token = utils.getQueryParam(this.app, 'token');
    var formData = $(evt.currentTarget).serializeObject();
    this.app.user.setPass(username, token, formData.passwordNew, function (err) {
      if (err) {
        this.showError(err);
      }
      else {
        this.close();
        this.showNotification('Password has been reset successfully.');
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

module.exports.id = "SetPassModal";
