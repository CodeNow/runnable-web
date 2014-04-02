var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');
var queryString = require('query-string');

var clone = function (o) {
  return JSON.parse(JSON.stringify(o));
};

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'filters',
  className: 'col-md-2 col-sm-3',
  events: {
    'click .show-more' : 'showMore',
    'click h3 > button': 'showAll',
    'click li'         : 'activateLoadingOverlay'
  },
  activateLoadingOverlay: function (evt) {
    this.app.set({loading: true});
  },
  activeFilters: [],
  qs: {},
  postHydrate: function () {
    this.listenTo(this.collection, 'change:filteringUrl', this.render.bind(this));
  },
  getTemplateData: function () {
    var opts = this.options;

    var activeFilterCategories = this.collection.where({
      "isActiveFilter": true
    });

    if (opts.filterMode == 'channel') {
      opts.filteringActive = (activeFilterCategories.length > 1);
    }
    else {
      opts.filteringActive = (activeFilterCategories.length > 0);
    }

    // SEO link generationw
    var self = this;
    var collection = this.collection;

    var qs = clone(self.qs);
    collection.each(function (channel) {
      var cloneQs = clone(qs);

      cloneQs.filter = cloneQs.filter || [];
      // qs can be string or array, force array
      cloneQs.filter = Array.isArray(cloneQs.filter) ?
        cloneQs.filter :
        [cloneQs.filter];

      var activeIndex = cloneQs.filter.indexOf(channel.get('name'));
      if (~activeIndex) { // this link removes itself from the filter (toggle filter off)
        cloneQs.filter.splice(activeIndex, 1);
      }
      else {              // this link add the channel to the filter set
        cloneQs.filter.push(channel.get('name'));
      }

      channel.set('filterLink', queryString.stringify(cloneQs));
    });

    return opts;
  },
  preRender: function () {
    var qs = this.qs = queryString.parse(utils.getCurrentUrlPath(this.app, false).split('?')[1]);
    if (qs.filter) {
      if (!_.isArray(qs.filter)) {
        qs.filter = [qs.filter];
      }
      this.activeFilters = qs.filter;
    }
    else {
      this.activeFilters = [];
    }
  },
  showAll: function (evt) {
    this.activeFilters = [];
    delete this.qs.filter;
    this.updateRoute();
  },
  updateRoute: function() {
    this.qs.page = 1;
    this.app.router.navigate(window.location.pathname + '?' + queryString.stringify(this.qs), {trigger: true});
  },
  showMore: function (evt) {
    var $ol = this.$('ol');

    if (!$ol.hasClass('in')) {
      $ol.addClass('in');
    }
  }
});

module.exports.id = "FeedFilters";
