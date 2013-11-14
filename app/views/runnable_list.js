var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  postHydrate: function () {
    this.listenTo(this.app.user, 'auth', this.render.bind(this));
    this.listenTo(this.collection, 'remove', this.render.bind(this));
  },
  getTemplateData: function () {
    var paramPage = this.collection.options.page || this.collection.params.page;
    var page = (paramPage+1) || 1;
    var showPrev = page >= 2;
    var showNext = this.collection.length == this.app.get('pageSize'); // if collection has max limit of models (25)
    var channel = this.collection.params.channel;
    var baseHref = (channel) ? '/'+channel : '/all';
    var prevLink;
    if (showPrev) prevLink = baseHref;
    if (page >= 3) prevLink = baseHref+'/page/'+(page-1);
    var nextLink;
    if (showNext) nextLink = baseHref+'/page/'+(page+1);
    return _.extend(this.options, {
      prevLink: prevLink,
      nextLink: nextLink,
      page: page
    });
  }
});

module.exports.id = "RunnableList";
