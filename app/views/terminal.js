var BaseView = require('./base_view');
var Super = BaseView.prototype;
var FilesSync = require('../models/files_sync');
var utils = require('../utils');


module.exports = BaseView.extend({
  className: 'terminal-view relative loading',
  events: {
    'click .file-sync'    : 'syncFiles',
    'click .message-us'   : 'popIntercom'
  },
  postHydrate: function () {
    this.onPostMessage = this.onPostMessage.bind(this);
  },
  postRender: function () {
    this.options.boxurl  = 'http://' + this.model.get('servicesToken') + '.' + this.app.get('domain');
    this.options.termurl = this.options.boxurl + '/static/term.html';
    this.loading(true);
    this.listenToPostMessages();
    this.$('iframe').attr('src', this.options.termurl);
    this.watchForIframeFocus();
  },
  getTemplateData: function () {
    this.options.isUserVerified = this.app.user.isVerified();
    this.options.boxurl  = 'http://' + this.model.get('servicesToken') + '.' + this.app.get('domain');
    this.options.termurl = this.options.boxurl + '/static/term.html';
    return this.options;
  },
  popIntercom: function(evt) {
    evt.stopImmediatePropagation();
    window.Intercom('show');
  },
  onPostMessage: function (message) {
    console.log('POST MESSAGE', message);
    if (message.data === 'show:loader') {
      this.loading(true);
    }
    else if (message.data === 'hide:loader') {
      this.loading(false);
    } 
    else if (message.data === 'term:dis') {
      console.log('Terminal has been disconected');
    }
    else if (message.data 
      && (message.data.indexOf('term:data') === 0)) {
      console.log("fix");
      //this.trackEvent('Command', { term_cmd: message.data.replace('term:data','') });
    }
  },
  listenToPostMessages: function () {
    window.addEventListener('message', this.onPostMessage);
  },
  stopListeningToPostMessages: function () {
    window.removeEventListener('message', this.onPostMessage);
  },
  watchForIframeFocus: function () {
    var self = this;
    var terminalHelp = self.$('#terminal-help');

    this.iframeFocused = false;
    function checkFocus() {
      if (!document.activeElement) return;
      var iframeFocused = document.activeElement == self.$('iframe')[0];
      if(iframeFocused !== self.iframeFocused) {
        self.iframeFocused = iframeFocused;
        if (iframeFocused) {
          terminalHelp.addClass('in');
          self.trackEvent('Focus');
        }
        else {
          terminalHelp.removeClass();
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
    var warningMessage = 'Uh oh, looks like your box is having some problems.<br> Try refreshing to the window - you may lose your changes.';
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
    var dispatch = this.app.dispatch;
    var sync = new FilesSync({
      containerId: this.model.id
    });
    var opts = utils.cbOpts(cb, this);
    this.disable(true);
    sync.save({}, opts);

    function cb (err) {
      var self = this;
      if (err) {
        this.showError(err);
      }
      else {
        this.disable(false);
        dispatch.trigger('sync:files');
      }
    }
  }
});

module.exports.id = "Terminal";
