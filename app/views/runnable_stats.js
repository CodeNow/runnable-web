var utils = require('../utils');
var BaseView = require('./base_view');

module.exports = BaseView.extend({
  preRender: function () {
    if (this.options.title) {
      this.tagName = 'p';
      this.className = 'runnable-stats title';
    } else {
      this.tagName = 'span';
      this.className = 'runnable-stats-wrapper'
    }
  },
  postHydrate: function () {
    this.$('[data-toggle=tooltip]').tooltip({
      placement: 'bottom'
    });
  }
});

module.exports.id = "RunnableStats";
