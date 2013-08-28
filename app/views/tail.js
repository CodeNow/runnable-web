var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  id: 'tail',
  postHydrate: function () {
    setTimeout(function () {
      this.loading(true); // setTimeout so it doesnt get overridden by the router start/end loader
    }.bind(this), 0)
    this.loadingTimeout = setTimeout(this.showError.bind('Error'), 10000);
    this.waitForLoad();
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
      .done(this.loaded)
      .fail(this.waitForLoad);
  },
  checkForRunning: function (data) {
    if (data.running) {
      this.loaded();
    } else {
      this.waitForLoad();
    }
  },
  loaded: function () {
    clearTimeout(this.loadingTimeout);
    this.app.dispatch.trigger('ready:box');
    this.loading(false);
  }
});

module.exports.id = "Tail";
