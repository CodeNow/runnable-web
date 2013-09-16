var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName:'a',
  preRender: function () {
    var app = this.app;
    var opts = this.options;
    if (utils.isCurrentURL(app, opts.href)) {
      this.className = opts.activeclass || 'active';
    }
    this.attributes = {
      href: opts.href
    }
  }
});

module.exports.id = "Link";
