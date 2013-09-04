var _ = require('underscore');
var BaseView = require('./base_view');
var _super = BaseView.prototype;

module.exports = BaseView.extend({
  tagName: 'li'
});

module.exports.id = 'RunnableItemView';
