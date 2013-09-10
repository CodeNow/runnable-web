var BaseView = require('./base_view');
var Images = require('../collections/images');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'div',
  className: 'search-results',
  postHydrate: function () {
    this.results = new Images(null, {app:this.app});
    this.listenTo(this.results, 'sync', this.render.bind(this));
  },
  search: function (text) {
    var opts = utils.cbOpts(this.showIfError, this);
    opts.data = {
      search: text,
      limit : 5
    };
    this.results.fetch(opts);
  },
  clear: function () {
    this.results.reset([]);
    this.render();
    this.$el.hide();
  },
  postRender: function () {
    if (this.results.length === 0) {
      this.$el.hide();
    }
    else {
      this.$el.show();
    }
  },
  getTemplateData: function () {
    return {
      collection: this.results
    };
  },
});

module.exports.id = "SearchResults";
