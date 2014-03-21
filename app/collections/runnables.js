var _ = require('underscore');
var Runnable = require('../models/runnable');
var Channels = require('../collections/channels');
var Base = require('./base');

module.exports = Base.extend({
  model: Runnable,
  parse: function (resp) {
    if (resp.channels) {
      this.relatedChannels = new Channels(resp.channels, { app: this.app });
    } else {
      this.relatedChannels = new Channels([], { app: this.app });
    }
    this.relatedChannels.params = this.params;
    if (resp.paging) {
      this.params.lastPage = resp.paging && resp.paging.lastPage;
      return resp.data;
    } else {
      return resp;
    }
  }
});