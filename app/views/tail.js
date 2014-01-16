var BaseView = require('./base_view');
var Super = BaseView.prototype;
var utils = require('../utils');

module.exports = BaseView.extend({
  id: 'output-terminal-container',
  className: 'resizable-iframe loading',
  postHydrate: function () {
    this.onPostMessage = this.onPostMessage.bind(this);
  },
  preRender: function () {
    var optClassName = this.options.classname;
    if (optClassName && !~this.className.indexOf(optClassName)) {
      this.className += ' ' + optClassName;
    }
  },
  postRender: function () {
    this.options.boxurl  = "http://" + this.model.get("servicesToken") + "." + this.app.get('domain');
    this.options.tailurl = this.options.boxurl + "/static/log.html";
    this.loading(true);
    this.listenToPostMessages();
    this.$('iframe').attr('src', this.options.tailurl);
    // in case build message gets stuck
    this.setBuildMessageTimeout();
    this.watchForIframeFocus();
  },
  watchForIframeFocus: function () {
    var self = this;
    this.iframeFocused = false;
    function checkFocus() {
      if (!document.activeElement) return;
      var iframeFocused = document.activeElement == self.$("iframe")[0];
      if(iframeFocused !== self.iframeFocused) {
        self.iframeFocused = iframeFocused;
        if (iframeFocused) {
          self.trackEvent('Focus');
        }
        else {
          self.trackEvent('Blur');
        }
      }
    }

    this.iframeFocusInterval = window.setInterval(checkFocus, 1000);
  },
  stopWatchingIframeFocus: function () {
    window.clearInterval(this.iframeFocusInterval);
  },
  setBuildMessageTimeout: function () {
    this.buildMessageTimeout = setTimeout(
      this.checkIfBuildMessageStuck.bind(this),
    800);
  },
  checkIfBuildMessageStuck: function () {
    if (this.stream == null) {
      this.setBuildMessageTimeout();
    }
    else if (this.stream != 'build') {
      this.app.dispatch.trigger('toggle:buildMessage', false);
    }
  },
  onPostMessage: function (message) {
    var dispatch = this.app.dispatch;
    console.log(message && message.data);
    if (!message || !message.data || !message.data.indexOf) {
      return; // unexpected message format (suspected to cause rollbar #1758)
    }
    else if (message.data === 'show:loader') {
      this.loading(true);
    }
    else if (message.data === 'hide:loader') {
      this.loading(false);
    }
    else if (message.data === 'parent:window') {
      // for some reason window.parent is not the original project window.
      this.parentWindow = message.source;
    }
    else if (message.data.indexOf('stream:') === 0) {
      this.onStreamPostMessage(message);
    }
  },
  onStreamPostMessage: function (message) {
    var dispatch = this.app.dispatch;
    this.stream = message.data.replace('stream:', '');
    this.showParentEl();
    if (this.stream === 'build') {
      dispatch.trigger('toggle:buildMessage', true);
      this.building = true;
    }
    else if (this.stream === 'error' && this.building) {
      this.building = false;
      this.$el.addClass('out');
      $('#output-terminal-container').addClass('in');
    }
    else { // this.stream === 'run'
      if (this.building) {
        // just finished building
        if (this.parentWindow && this.parentWindow.postMessage) {
          this.parentWindow.postMessage('completed:build', '*');
        }
      }
      this.building = false;
      clearTimeout(this.buildMessageTimeout);
      dispatch.trigger('toggle:buildMessage', false);
    }
  },
  showParentEl: function () {
    this.parentView.$el.addClass('in');
  },
  refreshIframe: function () {
    var src = this.$('iframe').attr('src');
    this.$('iframe').attr('src', src);
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
    this.stopWatchingIframeFocus();
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
    this.warningTimeout = setTimeout(this.showError.bind(this, warningMessage), 20000);
  },
  stopWarningTimeout: function () {
    clearTimeout(this.warningTimeout);
  }
});

module.exports.id = "Tail";
