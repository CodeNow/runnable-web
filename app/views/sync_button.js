var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');
var FilesSync = require('../models/files_sync')
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  tagName: 'li',
  attributes: {
    'data-title' : 'Refresh Files'
  },
  className: 'pull-right tooltip',
  events: {
    'click' : 'click'
  },
  postHydrate: function () {
    this.onPostMessage = this.onPostMessage.bind(this);
    this.listenToPostMessages()
  },
  listenToPostMessages: function () {
    window.addEventListener("message", this.onPostMessage);
  },
  stopListeningToPostMessages: function () {
    window.removeEventListener("message", this.onPostMessage);
  },
  onPostMessage: function (message) {
    if (message && message.data == 'completed:build') {
      //debugger;

      this.$el.click()
    }
  },
  click: function (evt) {
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
    sync.save({}, opts)
    function cb (err) {
      var self = this;
      if (err) { this.showError(err); } else {
        this.disable(false);
        dispatch.trigger('sync:files')
      }
    }
  },
  remove: function () {
    this.stopListeningToPostMessages();
    Super.remove.apply(this, arguments);
  },
  showError: function () {
    this.disable(false);
    Super.showError.apply(this, arguments);
  }
});

module.exports.id = "SyncButton";
