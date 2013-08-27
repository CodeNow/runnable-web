var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  id: 'tail',
  postHydrate: function () {
    setTimeout(function () {
      this.loading(true); // setTimeout so it doesnt get overridden by the router start/end loader
    }.bind(this), 0)
    this.listenToWindowMessage();
  },
  postRender: function () {
    var $iframe = this.$iframe = this.$('iframe');
    var url = "http://" + this.model.get("servicesToken")+ "." + this.app.get('domain') + "/static/log.html";
    $iframe.attr('src', url);
  },
  listenToWindowMessage: function () {
    var dispatch = this.app.dispatch;
    var timeout;
    if (this.onWindowMessage) {
      this.removeWindowMessageListener();
    }
    else {
      this.onWindowMessage = function (evt) {
        var hostname = window.location.host.split(':')[0]; //no port
        var runnableSubdomain = new RegExp(hostname.replace('.', '\\.')); //esc periods
        if (runnableSubdomain.test(evt.origin)) {
          clearTimeout(timeout);
          dispatch.trigger('ready:box');
          this.loading(false);
        }
      }.bind(this);
    }
    timeout = setTimeout(this.showError.bind('Error'), 10000);
    window.addEventListener('message', this.onWindowMessage);
  },
  removeWindowMessageListener: function () {
    window.removeEventListener('message', this.onWindowMessage);
  },
  remove: function () {
    this.removeWindowMessageListener();
    Super.remove.apply(this, arguments);
  },
  loading: function (bool) {
    Super.loading.call(this, bool);
    this.app.set('loading', bool);
  }
});

module.exports.id = "Tail";
