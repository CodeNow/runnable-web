var BaseView = require('./base_view');
var _ = require('underscore');
var utils = require('../utils');

module.exports = BaseView.extend({
  getTemplateData: function() {
    var currentUrl = utils.getCurrentUrlPath(this.app);
    var opts = this.options;

    // page links
    this.pageLinks(currentUrl, opts);

    return opts;
  },
  pageLinks: function (currentUrl, opts) {
    // messy :(
    var collectionParams = this.collection.params || {};
    collectionParams.page = parseInt(collectionParams.page);
    collectionParams.lastPage = parseInt(collectionParams.lastPage);

    opts.page = collectionParams.page + 1;

    var lastPage = opts.lastPage = collectionParams.lastPage + 1 || 1;
    opts.lastPageIndex = lastPage - 1;

    opts.previousPage = collectionParams.page - 1;
    opts.nextPage = collectionParams.page + 1;

    // next and prev links
    if (opts.page > 1) {
      opts.prevLink = utils.addPageQuery(currentUrl, opts.page - 1);
    }
    if (opts.page < lastPage) {
      opts.nextLink = utils.addPageQuery(currentUrl, opts.page + 1);
    }

    opts.showLeftElipsis = true;
    if (opts.page == 2) {
      opts.showLeftElipsis = false;
    }

    opts.showRightElipsis = true;
    if (opts.page == (opts.lastPage - 1)) {
      opts.showRightElipsis = false;
    }

  }
});

module.exports.id = "PaginationButtons";
