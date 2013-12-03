var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName:'li',
  preRender: function () {
    var app = this.app;
    var opts = this.options;
    if (utils.isCurrentUrl(app, opts.href)) {
      this.className = opts.activeclass || 'active';
    }
  }
});

module.exports.id = "ItemLink";
