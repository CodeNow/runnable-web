var BaseAppView = require('rendr/shared/base/app_view');
var Super = BaseAppView.prototype;

var $body = $('body');

module.exports = BaseAppView.extend({
  postInitialize: function() {
    this.app.on('change:loading', function(app, loading) {
      $body.toggleClass('loading', loading);
    }, this);
  },
  _interceptClick: function(e) {
    var properties = {}
    if (e.currentTarget) {
      properties.href =  $(e.currentTarget).attr('href');
    }
    Track.event('App', 'Click Link', properties);
    Super._interceptClick.apply(this, arguments);
  },
});
