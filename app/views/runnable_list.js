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
    // page links
    this.pageLinks(currentUrl, opts);
    // sort tabs
    var currentUrlNoQuery = utils.getCurrentUrlPath(this.app, true);
    opts.sorts = [
      {
        sort: 'created',
        href: currentUrlNoQuery,
        label: 'Trending'
      },
      {
        sort: 'runs',
        href: currentUrlNoQuery + '?sort=runs',
        label: 'Popular'
      }
    ];
    opts.sort = utils.getQueryParam(this.app, 'sort') || 'created';

    this.collection.sort();
    return opts;
  },
  pageLinks: function (currentUrl, opts) {
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
  }
});

module.exports.id = "RunnableList";
