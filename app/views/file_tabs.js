var BaseView = require('./base_view');

module.exports = BaseView.extend({
  preRender: function () {
    var self = this;
    var opts = self.options;

    if (!opts.select) {
      // default tabs
      self.tagName = 'ul';
      self.id = 'project-editor-tabs';
      self.className = 'nav nav-tabs';
    } else {
      // select menu tabs
      self.tagName = 'select';
    }
  },
  postHydrate: function () {
    this.listenTo(this.collection, 'add remove', this.render.bind(this));
  }
});

module.exports.id = "FileTabs";
