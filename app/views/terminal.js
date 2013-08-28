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
    $.get("http://" + this.model.get("servicesToken") + "." + this.app.get('domain') + "/api/running").always(function() { 
      self.$iframe.attr('src', "http://" + self.model.get("servicesToken") + "." + self.app.get('domain') + "/static/term.html");
    });
  },
  postHydrate: function () {
    setTimeout(function () {
      this.app.set('loading', true); // setTimeout so it doesnt get overridden by the router start/end loader
      this.loading(true);
    }.bind(this), 0);
    this.loadingTimeout = setTimeout(this.loaded.bind(this), 5000);
    this.waitForLoad.call(this);
  },
  waitForLoad: function () {
    var url = "http://" + this.model.get("servicesToken") + "." + this.app.get('domain') + "/api/running";
    $.get(url)
      .done(this.loaded.bind(this))
      .fail(this.waitForLoad.bind(this));
  },
  loaded: function () {
    clearTimeout(this.loadingTimeout);
    this.app.dispatch.trigger('ready:box');
    this.app.set('loading', false);
    this.loading(false);
  }
});

module.exports.id = "Terminal";
