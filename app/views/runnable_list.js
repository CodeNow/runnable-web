var BaseView = require('./base_view');
var _ = require('underscore');
var utils = require('../utils');

module.exports = BaseView.extend({
  postHydrate: function () {
    this.listenTo(this.app.user, 'auth', this.render.bind(this));
    this.listenTo(this.collection, 'remove', this.render.bind(this));
  },
  getTemplateData: function () {
    var currentUrl = utils.getCurrentUrlPath(this.app);
    var opts = this.options;
    var collectionParams = this.collection.params || {};
    opts.page = collectionParams.page + 1;
    var lastPage = opts.lastPage = collectionParams.lastPage || 1;

    // next and prev links
    if (opts.page > 1) {
      opts.prevLink = utils.addPageQuery(currentUrl, opts.page-1);
    }
    if (opts.page < lastPage) {
      opts.nextLink = utils.addPageQuery(currentUrl, opts.page+1);
    }

    // page links
    var span = 9, start, end;
    opts.links = [];
    if (opts.page < span/2) {
      start = 1;
      end = start+span;
    }
    else if (opts.page > (lastPage - span/2)) {
      start = lastPage-span;
      end = lastPage;
    }
    else {
      start = Math.floor(opts.page - span/2);
      end   = Math.floor(opts.page + span/2);
    }
    // start end corrections
    if (start <= 0) start = 1;
    if (lastPage < end) end = lastPage;
    for (var i = start; i<=end; i++) {
      console.log(i);
      opts.links.push({
        page: i,
        link: utils.addPageQuery(currentUrl, i)
      });
    }

    this.collection.sort();
    return opts;
  }
});

module.exports.id = "RunnableList";
