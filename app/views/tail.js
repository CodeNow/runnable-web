var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  id: 'tail',
  postHydrate: function () {
    setTimeout(function () {
      this.loading(true); // setTimeout so it doesnt get overridden by the router start/end loader
    }.bind(this), 0)
    this.loadingTimeout = setTimeout(this.showError.bind(this, 'Error'), 10000);
    this.waitForLoad.call(this);
  },
  postRender: function () {
    var $iframe = this.$iframe = this.$('iframe');
    var url = "http://" + this.model.get("servicesToken")+ "." + this.app.get('domain') + "/static/log.html";
    $iframe.attr('src', url);
  },
  loading: function (bool) {
    Super.loading.call(this, bool);
    this.app.set('loading', bool);
  },
  waitForLoad: function () {
    var url = "http://" + this.model.get("servicesToken") + "." + this.app.get('domain') + "/api/running";
    $.getJSON(url)
      .done(this.loaded.bind(this))
      .fail(this.waitForLoad.bind(this));
  },
  checkForRunning: function (data) {
    if (data.running) {
      this.loaded.call(this);
    } else {
      this.waitForLoad.call(this);
    }
  },
  loaded: function () {
    clearTimeout(this.loadingTimeout);
    this.app.dispatch.trigger('ready:box');
    this.loading(false);
  }
});

module.exports.id = "Tail";
