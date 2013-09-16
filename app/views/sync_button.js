var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');
var FilesSync = require('../models/files_sync')
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  tagName: 'a',
  attributes: { 'href':'javascript:void(0);' },
  events: {
    'click' : 'click'
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
  showError: function () {
    this.disable(false);
    Super.showError.apply(this, arguments);
  }
});

module.exports.id = "SyncButton";
