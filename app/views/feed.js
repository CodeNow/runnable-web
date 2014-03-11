var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'feed',
  getTemplateData: function () {
    var opts = this.options;
    opts.orderBy = utils.getQueryParam(this.app, 'orderBy');
    if(!opts.orderBy)
      opts.orderBy = 'trending'; //default

    if(opts.orderBy == 'trending'){
      opts.orderByTrending = true;
      opts.orderByPopular = false;
    }else{
      opts.orderByTrending = false;
      opts.orderByPopular = true;
    }
    return opts;
  },
  postRender: function () {
    //triggered from feed_toggles.js
    this.app.dispatch.on('toggle:toggleFeed', function (data) {
      this.$el.find('#feed_trending_container').hide();
      this.$el.find('#feed_popular_container').hide();
      this.$el.find('#feed_' + data + '_container').show();
    }, this);
  }
});

module.exports.id = "Feed";
