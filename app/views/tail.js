var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  id: 'output-terminal-container',
  className: 'resizable-iframe loading',
  getTemplateData: function () {
    this.options.boxurl  = "http://" + this.model.get("servicesToken") + "." + this.app.get('domain');
    this.options.tailurl = this.options.boxurl + "/static/log.html";
    return this.options;
  },
  postRender: function () {
    // this.$iframe = this.$('iframe');
    // this.$iframe.load(this.loading.bind(this, false));
    this.checkBoxUp();
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
    this.warningTimeout = setTimeout(this.showError.bind(this, warningMessage), 10000);
  },
  stopWarningTimeout: function () {
    clearTimeout(this.warningTimeout);
  }
});

module.exports.id = "Tail";
