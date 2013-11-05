var BaseView = require('./base_view');
var Super = BaseView.prototype;

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
    this.options.tailurl = this.options.boxurl + "/dynamic/tail";
    this.loading(true);
    this.listenToPostMessages();
    this.$('iframe').attr('src', this.options.tailurl);
    // in case build message gets stuck
    this.setBuildMessageTimeout();
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
      dispatch.trigger('toggle:buildMessage', false);
    }
  },
  onPostMessage: function (message) {
    var dispatch = this.app.dispatch;
    if (message.data === 'show:loader') {
      this.loading(true);
    }
    else if (message.data === 'hide:loader') {
      this.loading(false);
    }
    else if (message.data.indexOf('stream:') === 0) {
      this.stream = message.data.replace('stream:', '');
      this.showParentEl();
      if (this.stream === 'build') {
        dispatch.trigger('toggle:buildMessage', true);
      }
      else {
        clearTimeout(this.buildMessageTimeout);
        dispatch.trigger('toggle:buildMessage', false);
      }
    }
    else if (message.data.indexOf('{') === 0) {
      var json = JSON.parse(message.data);
      if (json.type === 'code') {
        this.handleCodePostMessage(json);
      }
    }
  },
  showParentEl: function () {
    this.parentView.$el.removeClass('hide');
  },
  handleCodePostMessage: function (json) {
    if (json.code+'' === '0' && this.stream === 'build') {
      // process completed successfully and was build process
      this.refreshIframe();
    }
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
