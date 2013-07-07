var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'nav',
  className: 'file-tabs',
  postHydrate: function () {
    this.listenTo(this.collection, 'add remove change:selected', this.render.bind(this));
  },
  getTemplateData: function () {
    return this.options;
  }
});

module.exports.id = "FileTabs";
