var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  id: 'project_tags',
  tagName: 'ul',
  className: 'tags',
  postHydrate: function () {
    this.listenTo(this.model, 'change:tags', this.render.bind(this));
  },
  getTemplateData: function () {
    var opts = this.options;
    return _.extend(opts, {
      isVerified: this.app.user.isVerified()
    });
  }
});

module.exports.id = "ProjectTags";
