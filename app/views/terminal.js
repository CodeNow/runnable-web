var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'terminal-view relative',
  events: {
    'click .icon-external-link' : 'popOpenTerminal'
  },
  popOpenTerminal: function () {
    window.open("http://" + this.model.get("servicesToken") + "." + this.app.get('domain') + "/static/term.html", "_blank");
  },
  postRender: function () {
    var self = this;
    this.$iframe = $('.terminal-iframe');
    $.get("http://" + this.model.get("servicesToken") + "." + this.app.get('domain') + "/api/env").always(function() { 
      self.$iframe.attr('src', "http://" + self.model.get("servicesToken") + "." + self.app.get('domain') + "/static/term.html");
    });
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
      var dispatch = this.app.dispatch;
      var timeout = setTimeout(function () {
        dispatch.trigger('ready:box');
        this.app.set('loading', false);
        this.loading(false);
      }.bind(this), 5000);
      this.onWindowMessage = function (evt) {
        var hostname = window.location.host.split(':')[0]; //no port
        var runnableSubdomain = new RegExp(hostname.replace('.', '\\.')); //esc periods
        if (runnableSubdomain.test(evt.origin)) {
          clearTimeout(timeout);
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
