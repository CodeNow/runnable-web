var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName:'section',
  className:'content',
  getTemplateData: function () {
    return this.options;
  }
});

module.exports.id = "runnable/index";
