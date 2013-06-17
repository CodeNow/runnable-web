var BaseView = require('./base_view');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName:'header',
  postInitialize: function () {
    /// ATTN this is where the user is set on the app for all the other views
    /// until we find a better location.. since this is the first view initialize
    /// and it has the current user.
    this.app.user = this.model;
  },
  postHydrate: function () {
    // read long comment above, postHydrate - same reason for clientside
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