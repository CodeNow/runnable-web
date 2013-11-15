var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName:'ul',
  postHydrate: function () {
    if (!this.collection.comparator)
      this.collection.sortByAttr('-created'); //clientside
    this.listenTo(this.collection, 'add remove', this.render.bind(this));
  },
  preRender: function () {
    this.className = this.options.classname;
  },
  getTemplateData: function () {
    this.options.isimage = this.collection instanceof require('../collections/images');
    return this.options;
  }
});

module.exports.id = "DashboardRunnables";
