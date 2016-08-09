var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'notify',
  modalOptions: {},
  postInitialize: function () {
    this.onClose = this.options.onClose;
    this.notifyMsg = this.options.notifyMsg;
  },
  preRender: function () {
    if (this.modalIsInBody()) {
      this.className = this.el.className;
    }
  },
  postRender: function () {
    var $body = $('body');
    if (!this.modalIsInBody()) {
      // first render
      $body.append(this.$el);
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
  modalIsInBody: function () {
    return $('body').has(this.$el).length !== 0;
  }
});

module.exports.id = "NotificationBar";
