var BaseView = require('../base_view');

module.exports = BaseView.extend({
  id:'about',
  postRender: function () {
    $.stellar();
  }
});

module.exports.id = "home/about";
