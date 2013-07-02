var _ = require('underscore');
var BaseView = require('./base_view');
var _super = BaseView.prototype;

module.exports = BaseView.extend({
  tagName:'li',
  getTemplateData: function () {
    return {
      json: this.model.toJSON(),
      model: this.model
    };
  }
});

module.exports.id = 'RunnableItemView';