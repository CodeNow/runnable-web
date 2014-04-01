var utils = require('../utils');
var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'p',
  className: 'runnable-stats title'
});

module.exports.id = "RunnableStats";
