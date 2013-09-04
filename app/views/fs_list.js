var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName: 'ul',
  className:'fs-list nav-collapse',
  preRender: function () {
    var opts = this.options;
    var actionClass = opts.parentId;
    this.className += (opts.open) ?
      ' '+actionClass+' in' :
      ' '+actionClass+' collapse';
  },
  postHydrate: function () {
    this.listenTo(this.collection, 'add remove reset sync', this.render.bind(this));
  },
  getTemplateData: function () {
    return this.options;
  }
});

module.exports.id = "FsList";