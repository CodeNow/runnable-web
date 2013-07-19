var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');
var FilesSync = require('../models/files_sync')

module.exports = BaseView.extend({
  tagName: 'button',
  className: 'hint--bottom btn-sync-file-browser',
  attributes: { 'data-hint':'Refresh file browser' },
  events: {
    'click' : 'click'
  },
  click: function () {
    var sync = new FilesSync({
      containerId: this.model.id
    });
    var opts = utils.cbOpts(cb);
    sync.save({}, opts)
    function cb () {
      this.app.dispatch.trigger('sync:files');
    }
  }
});

module.exports.id = "SyncButton";
