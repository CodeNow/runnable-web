var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'terminal-view relative loading',
  postRender: function () {
    // this.$('iframe').load(this.loading.bind(this, false));
    this.checkBoxUp();
  },
  getTemplateData: function () {
    this.options.boxurl  = "http://" + this.model.get("servicesToken") + "." + this.app.get('domain');
    this.options.termurl = this.options.boxurl + "/static/term.html";
    return this.options;
  },
  checkBoxUp: function () {
    var self = this;
    this.loading(true);
    this.sock = new SockJS(this.options.boxurl+'/streams/log');
    this.sock.onopen = this.loading.bind(this, false);
    this.sock.onclose = function () {
      self.loading(true);
      self.sock.close();
      self.checkBoxUp();
    }
  },
  remove: function () {
    this.sock.onclose = function () {};
    this.sock.close();
    Super.remove.apply(this, arguments);
  },
  loading: function (loading) {
    console.log(loading);
    this.stopWarningTimeout();
    if (loading) this.startWarningTimeout();
    Super.loading.apply(this, arguments);
  },
  startWarningTimeout: function () {
    var self = this;
    var warningMessage = "Uh oh, looks like your box is having some problems.<br> Try refreshing to the window - you may lose your changes.";
    this.warningTimeout = setTimeout(this.showError.bind(this, warningMessage), 20000);
  },
  stopWarningTimeout: function () {
    clearTimeout(this.warningTimeout);
  }
});

module.exports.id = "Terminal";
