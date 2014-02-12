var utils = require('../utils');
var BaseView = require('./base_view');

module.exports = BaseView.extend({
  preRender: function () {
    var self = this;

    if (self.options.title) {
      self.tagName = 'p';
      self.className = 'runnable-stats title';
    } else {
      self.tagName = 'span';
      self.className = 'runnable-stats-wrapper';
    }
  }
});

module.exports.id = "RunnableStats";
