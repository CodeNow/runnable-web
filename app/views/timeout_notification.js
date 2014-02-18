var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'overlay-loader with-text',
  events: {
    'click button' : 'refresh',
    'click a'      : 'dismiss'
  },
  refresh: function () {
    window.location.reload();
  },
  dismiss: function () {
    this.$el.removeClass('loading');
    $('body').removeClass('modal-open');
  }
});

module.exports.id = "TimeoutNotification";
