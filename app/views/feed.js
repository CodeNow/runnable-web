var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'feed',
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
