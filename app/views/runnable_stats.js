var utils = require('../utils');
var BaseView = require('./base_view');

module.exports = BaseView.extend({
  preRender: function () {
    if (this.options.title) {
      this.tagName = 'p';
      this.className = 'runnable-stats title';
    }
  },
  postHydrate: function () {
    this.$('[data-toggle=tooltip]').tooltip({
      placement: 'bottom'
    });
  }
});

module.exports.id = "RunnableStats";
