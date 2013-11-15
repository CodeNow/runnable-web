var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'terminal-view relative loading',
  postHydrate: function () {
    this.onPostMessage = this.onPostMessage.bind(this);
  },
  postRender: function () {
    this.options.boxurl  = "http://" + this.model.get("servicesToken") + "." + this.app.get('domain');
    this.options.termurl = this.options.boxurl + "/static/term.html";
    this.loading(true);
    this.listenToPostMessages();
    this.$('iframe').attr('src', this.options.termurl);
  },
  getTemplateData: function () {
    this.options.boxurl  = "http://" + this.model.get("servicesToken") + "." + this.app.get('domain');
    this.options.termurl = this.options.boxurl + "/static/term.html";
    return this.options;
  },
  onPostMessage: function (message) {
    if (message.data === 'show:loader') {
      this.loading(true);
    }
    else if (message.data === 'hide:loader') {
      this.loading(false);
    }
  },
  listenToPostMessages: function () {
    window.addEventListener("message", this.onPostMessage);
  },
  stopListeningToPostMessages: function () {
    window.removeEventListener("message", this.onPostMessage);
  },
  remove: function () {
    this.blockWarning = true;
    this.stopWarningTimeout();
    this.stopListeningToPostMessages();
    // this.sock.onclose = function () {};
    // this.sock.close();
    Super.remove.apply(this, arguments);
  },
  loading: function (loading) {
    this.stopWarningTimeout();
    if (loading) this.startWarningTimeout();
    Super.loading.apply(this, arguments);
  },
  startWarningTimeout: function () {
    var self = this;
    var warningMessage = "Uh oh, looks like your box is having some problems.<br> Try refreshing to the window - you may lose your changes.";
    this.warningTimeout = setTimeout(function () {
      if (this.blockWarning) return;
      self.showError.bind(this, warningMessage)
    }, 10000);
  },
  stopWarningTimeout: function () {
    clearTimeout(this.warningTimeout);
  }
});

module.exports.id = "Terminal";
