var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');
var FilesSync = require('../models/files_sync')

module.exports = BaseView.extend({
  tagName: 'button',
  events: {
    'click' : 'click'
  },
  click: function () {
    var sync = new FilesSync({
      containerId: this.model.id
    });
    var opts = utils.cbOpts(cb.bind(this));
    this.disable(true);
    sync.save({}, opts)
    function cb () {
      this.disable(false);
      this.app.dispatch.trigger('sync:files');
    }
  }
});

module.exports.id = "SyncButton";
