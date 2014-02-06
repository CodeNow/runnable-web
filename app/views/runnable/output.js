var BaseView = require('../base_view');

module.exports = BaseView.extend({
  id: 'output',
  // resizing logic lives in web.js
  postRender: function () {
    $('html').addClass('no-satisfaction');
  }
});

module.exports.id = "runnable/output";
