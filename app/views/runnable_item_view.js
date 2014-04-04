var _ = require('underscore');
var BaseView = require('./base_view');
var _super = BaseView.prototype;
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'li',
  getTemplateData: function () {
    this.options.user = this.app.user;
    return this.options;
  }
});

module.exports.id = 'RunnableItemView';
