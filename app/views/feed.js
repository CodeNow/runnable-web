var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'feed',
  getTemplateData: function () {
    var opts = this.options;
    opts.orderBy = utils.getQueryParam(this.app, 'orderBy');
    if (!opts.orderBy) {
      opts.orderBy = 'trending'; //default
    }

    if (opts.orderBy == 'trending') {
      opts.orderByTrending = true;
      opts.orderByPopular = false;
    }
    else {
      opts.orderByTrending = false;
      opts.orderByPopular = true;
    }
    return opts;
  },
  postRender: function () {
    var $sort = this.$('.sort');

    //triggered from feed_toggles.js
    this.app.dispatch.on('toggle:toggleFeed', function (data) {
      $sort.toggleClass ('sort-popular sort-trending');
    }, this);
  }
});

module.exports.id = "Feed";
