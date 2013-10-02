var BaseView = require('../base_view');

module.exports = BaseView.extend({
  id:'hundo',
  postRender: function () {
    setInterval(function () {
      $('.gsfn-widget-tab').remove();
    }, 1000);
  }
});

module.exports.id = "runnable/lockterminal";
