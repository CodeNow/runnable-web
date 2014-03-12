var BaseView = require('./base_view');
var queryString = require('query-string');

module.exports = BaseView.extend({
  className: 'btn-group',
  events: {
    'click button' : 'toggleFeed'
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
    return opts;
  },
  toggleFeed: function (evt) {
    this.$('button').toggleClass('active');
    var id = this.$(evt.currentTarget).attr('id');
    if (this.app.dispatch) {
      this.app.dispatch.trigger('toggle:toggleFeed', id);
    }

    var qs = queryString.parse(location.search);
    qs.orderBy = id;
    this.app.router.navigate(window.location.pathname + '?' + queryString.stringify(qs));
  }
});

module.exports.id = "FeedToggles";
