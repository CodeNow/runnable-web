var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName:'li',
  getTemplateData: function () {
    return {
      image: this.model
    };
  }
});

module.exports.id = "RunnableItemSmall";
