var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  preRender: function () {
    this.attributes = {};
    if (this.options.className) this.attributes.className = this.options.className;
  },
  getTemplateData: function () {
    var page = this.collection.params.page || 1;
    var showPrev = page >= 2;
    var showNext = this.collection.length == 25; // if collection has max limit of models (25)
    var channel = this.collection.params.channel;
    var baseHref = (channel) ? '/channel/' : '/';
    var prevLink = showPrev && baseHref && page >= 3 && baseHref+'page/'+(page-1);
    var nextLink = showNext && baseHref+'page/'+(page+1);
    return _.extend(this.options, {
      prevLink: prevLink,
      nextLink: nextLink
    });
  }
});

module.exports.id = "RunnableList";
