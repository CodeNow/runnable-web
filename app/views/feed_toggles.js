var BaseView = require('./base_view');
var queryString = require('query-string');
var utils = require('../utils');

module.exports = BaseView.extend({
  className: 'btn-group toggles',
  events: {
  },
  getTemplateData: function () {
    var opts = this.options;
    if (opts.defaultActive == 'popular') {
      opts.activeTrending = false;
      opts.activePopular = true;
    }
    else {
      opts.activeTrending = true;
      opts.activePopular = false;
    }

    var qs = queryString.parse(utils.getCurrentUrlPath(this.app, false).split('?')[1]);
    var qsTrending = JSON.parse(JSON.stringify(qs));
    var qsPopular  = JSON.parse(JSON.stringify(qs));

    qsTrending.orderBy = 'trending';
    qsPopular.orderBy  = 'popular';

    opts.trendingLink = queryString.stringify(qsTrending);
    opts.popularLink  = queryString.stringify(qsPopular);

    return opts;
  }
});

module.exports.id = "FeedToggles";
