var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'ul',
  id: 'project-editor-tabs',
  className: 'nav nav-tabs',
  postHydrate: function () {
    this.listenTo(this.collection, 'add remove', this.render.bind(this));
  },
  postRender: function () {
    this.$('[rel="tooltip"]').tooltip({
      container: 'body'
    });
  }
});

module.exports.id = "FileTabs";
