var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName:'ul',
  postHydrate: function () {
    if (!this.collection.comparator)
      this.collection.sortByAttr('-created'); //clientside
    this.listenTo(this.collection, 'add remove', this.renderAndKeepClass.bind(this));
  },
  preRender: function () {
    if (!this.className) {
      this.className = 'runnable-feed';
      if (this.options.isactive) {
        this.className += ' in';
      }
    }
  },
  postRender: function () {
    window.views = window.views || [];
    window.views.push(this);
  },
  renderAndKeepClass: function () {
    this.className = this.$el.prop('class');
    this.render();
  },
  getTemplateData: function () {
    this.options.isimage = this.collection instanceof require('../collections/images');
    return this.options;
  }
});

module.exports.id = "DashboardRunnables";
