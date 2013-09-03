var BaseView = require('../base_view');

module.exports = BaseView.extend({
  postRender: function () {
    // Enable Bootstrap-Select
    this.$('.selectpicker').selectpicker();
  }
});

module.exports.id = "channel/index";
