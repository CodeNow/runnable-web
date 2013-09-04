var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'terminal-view relative',
  postRender: function () {
    var self = this;
    this.$iframe = this.$('.terminal-iframe');
    this.$popoutLink = this.$('a');
    $.get("http://" + this.model.get("servicesToken") + "." + this.app.get('domain') + "/api/running").always(function() {
      self.src = "http://" + self.model.get("servicesToken") + "." + self.app.get('domain') + "/static/term.html";
      self.$iframe.attr('src', self.src);
      self.$popoutLink.attr('href', self.src);
      self.$popoutLink.attr('target', '_blank');
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
