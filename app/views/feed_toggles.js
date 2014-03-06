var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'btn-group',
  events: {
    'click button' : 'toggleFeed'
  },
  toggleFeed: function () {
    this.$('button').toggleClass('active');
  }
});

module.exports.id = "FeedToggles";
