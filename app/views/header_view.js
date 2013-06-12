var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName:'header',
  getTemplateData: function () {
    return {
      user: this.model.toJSON(),
      projectsCollection: this.options.context.projects
    };
  },
  postRender: function () {

  }
});

module.exports.id = 'HeaderView';