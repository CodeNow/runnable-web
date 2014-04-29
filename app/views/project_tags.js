var BaseView = require('./base_view');

module.exports = BaseView.extend({
  id: 'project_tags',
  attributes: {
    style: 'display: inline-block;' //TODO: Talk to tony and make this not inline css
  },
  postHydrate: function () {
    this.listenTo(this.model, 'change:tags', this.render.bind(this));
  }
});

module.exports.id = "ProjectTags";
