var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'overlay-loader with-text',
  events: {
    'click button' : 'refresh',
    'click a'      : 'dismiss'
  },
  postRender: function () {
    var self = this;

    // setTimeout(function(){
    //   self.$el.addClass('loading');
    // },5000);
  },
  refresh: function () {
    window.location.reload();
  },
  dismiss: function () {
    // remove loading and body class
  }
});

module.exports.id = "TimeoutNotification";
