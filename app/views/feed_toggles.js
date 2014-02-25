var BaseView = require('./base_view');

module.exports = BaseView.extend({
  events: {
    'click .out' : 'toggleFeed'
  },
  toggleFeed: function () {
    this.$('button').toggleClass('in out');
  }
});

module.exports.id = "FeedToggles";
