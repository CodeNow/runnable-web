var BaseAppView = require('rendr/shared/base/app_view');

var $body = $('body');

module.exports = BaseAppView.extend({
  postInitialize: function() {
    this.app.on('change:loading', function(app, loading) {
      $body.toggleClass('loading', loading);
    }, this);
  },
  setCurrentView: function(view) {
    this.$content.find('*').eq(0).replaceWith(view.$el);
    view.render();
  }
});
