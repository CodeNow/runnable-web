var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'btn-group',
  events: {
    'click button' : 'toggleFeed'
  },
  toggleFeed: function (evt) {
    this.$('button').toggleClass('active');
    if(this.app.dispatch)
      this.app.dispatch.trigger('toggle:toggleFeed', this.$(evt.currentTarget).attr('id'));
  }
});

module.exports.id = "FeedToggles";
