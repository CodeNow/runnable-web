var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName:'li',
  getTemplateData: function () {
    return {
      projectJSON: this.model.toJSON(),
      project: this.model
    };
  }
});

module.exports.id = "ProjectItemSmall";
