var BaseView = require('./base_view');
var Super = BaseView.prototype;
var FilesSync = require('../models/files_sync');
var utils = require('../utils');


module.exports = BaseView.extend({
  className: 'terminal-view relative loading',
  events: {
    "click .TerminalHelp li" : "syncFiles",
    "click .TerminalHelp .messageTrigger" : "popIntercom"
  },
  popIntercom: function(evt) {
    evt.stopImmediatePropagation();
    window.Intercom('show');
  },
  postHydrate: function () {
    var self = this;

    this.onPostMessage = this.onPostMessage.bind(this);
    this.$('.TerminalHelp').hide();

    this.$('.TerminalHelp').focusout(function() {
      self.$(".TerminalHelp").hide();
    });
  },
  postRender: function () {
    this.options.boxurl  = "http://" + this.model.get("servicesToken") + "." + this.app.get('domain');
    this.options.termurl = this.options.boxurl + "/static/term.html";
    this.loading(true);
    this.listenToPostMessages();
    this.$('iframe').attr('src', this.options.termurl);
    this.watchForIframeFocus();
  },
  getTemplateData: function () {
    this.options.boxurl  = "http://" + this.model.get("servicesToken") + "." + this.app.get('domain');
    this.options.termurl = this.options.boxurl + "/static/term.html";
    return this.options;
  },
  onPostMessage: function (message) {
    console.log('POST MESSAGE', message);
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
  watchForIframeFocus: function () {
    var self = this;
    this.iframeFocused = false;
    function checkFocus() {
      if (!document.activeElement) return;
      var iframeFocused = document.activeElement == self.$("iframe")[0];
      var syncButtonFocused = document.activeElement == self.$("li")[0];

      if(iframeFocused !== self.iframeFocused) {

        self.iframeFocused = iframeFocused;
        if (iframeFocused) {
          self.$('.TerminalHelp').show();
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
    this.warningTimeout = setTimeout(function () {
      if (this.blockWarning) return;
      self.showError.bind(this, warningMessage);
    }, 10000);
  },
  stopWarningTimeout: function () {
    clearTimeout(this.warningTimeout);
  },
  syncFiles: function (evt) {
    evt.preventDefault();
    if ($(evt.currentTarget).attr('disabled')) {
      return;
    }
    var dispatch = this.app.dispatch;
    var sync = new FilesSync({
      containerId: this.model.id
    });
    var opts = utils.cbOpts(cb, this);
    this.disable(true);
    sync.save({}, opts);

    function cb (err) {
      var self = this;
      console.log("Listening to the trigger event 1337");
      if (err) { this.showError(err); } else {
        this.disable(false);
        dispatch.trigger('sync:files')
      }
    }
  },
});

module.exports.id = "Terminal";
