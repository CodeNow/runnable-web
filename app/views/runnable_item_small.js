var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName:'li',
  getTemplateData: function () {
    var model = this.options.model;
    model.virtuals = {
      nameWithTags: model.nameWithTags(true),
      appURL: model.appURL()
    }
    return this.options;
  }
});

module.exports.id = "RunnableItemSmall";
