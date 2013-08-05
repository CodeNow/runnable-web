var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName:'a',
  preRender: function () {
    var app = this.app;
    var href = this.options.href;
    if (utils.isCurrentURL(app, href)) {
      this.className = 'selected';
    }
    this.attributes = {
      href: href
    }
  }
});

module.exports.id = "Link";
