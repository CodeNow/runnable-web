var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'iframe',
  className: 'console-output',
  postHydrate: function () {
    this.listenToWindowMessage();
  },
  preRender: function () {
    var url = "http://" + this.model.get("servicesToken")+ "." + this.app.get('domain') + "/static/log.html";
    this.attributes = {
      src: url
    };
  },
  listenToWindowMessage: function () {
    if (this.onWindowMessage) {
      this.removeWindowMessageListener();
    }
    else {
      this.onWindowMessage = function (evt) {
        var hostname = window.location.host.split(':')[0]; //no port
        var runnableSubdomain = new RegExp(hostname.replace('.', '\\.')); //esc periods
        var dispatch = this.app.dispatch;
        var timeout = setTimeout(dispatch.trigger.bind(dispatch, 'ready:box'), 5000);
        if (runnableSubdomain.test(evt.origin)) {
          clearTimeout(timeout);
          dispatch.trigger('ready:box');
          this.app.set('loading', false);
          this.loading(false);
        }
      }.bind(this);
    }
    window.addEventListener('message', this.onWindowMessage);
  }
});

module.exports.id = "Tail";
