var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'terminal-view relative',
  events: {
    'click .icon-external-link' : 'popOpenTerminal'
  },
  popOpenTerminal: function () {
    window.open("http://terminals." + this.app.get('domain') + "/term.html?termId=" + this.model.get("token"), "_blank");
  },
  postRender: function () {
    this.$iframe = $('.terminal-iframe');
    this.$iframe.attr('src', "http://terminals." + this.app.get('domain') + "/term.html?termId=" + this.model.get("token"));
  },
  postHydrate: function () {
    setTimeout(function () {
      this.app.set('loading', true); // setTimeout so it doesnt get overridden by the router start/end loader
      this.loading(true);
    }.bind(this), 0)
    this.listenToWindowMessage();
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
        if (runnableSubdomain.test(evt.origin)) {
          dispatch.trigger('ready:box');
          this.app.set('loading', false);
          this.loading(false);
        }
      }.bind(this);
    }
    window.addEventListener('message', this.onWindowMessage);
  },
  removeWindowMessageListener: function () {
    window.removeEventListener('message', this.onWindowMessage);
  },
  remove: function () {
    this.removeWindowMessageListener();
    Super.remove.apply(this, arguments);
  }
});

module.exports.id = "Terminal";
