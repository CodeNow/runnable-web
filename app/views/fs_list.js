var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName: 'ul',
  className: 'display-none',
  postInitialize: function () {
    // initial page hit renders open
    if (this.options.open) {
      this.className = "";
    }
  },
  postHydrate: function () {
    this.listenTo(this.collection, 'add remove reset sync', this.render.bind());
  },
  getTemplateData: function () {
    return {
      collection: this.options.collection
    };
  }
});

module.exports.id = "FsList";