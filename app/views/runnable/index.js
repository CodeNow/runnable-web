var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName:'section',
  className:'content'
});

module.exports.id = "runnable/index";
