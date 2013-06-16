var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName:'header',
  postHydrate: function () {
    /// ATTN this is where the user is set on the app for all the other views
    /// until we find a better location.. since this is the first view initialize
    /// and it has the current user.
    this.app.user = this.model;
  },
  getTemplateData: function () {
    return {
      user: this.model.toJSON(),
      projectsCollection: this.options.context.projects
    };
  }
});

module.exports.id = 'HeaderView';