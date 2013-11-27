var utils = require('../utils');
var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'p',
  className: 'runnable-stats',
  events: {
    'click .vote button' : 'heartScale'
  },
  preRender: function () {
    var optsTitle = this.options.title;

    if (optsTitle) {
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
