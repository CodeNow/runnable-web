var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');
var queryString = require('query-string');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'filters',
  className: 'col-md-2 col-sm-3',
  events: {
    'click .show-more':               'showMore',
    'click [data-action="show-all"]': 'showAll',
    'click ol li':                  'activateLoadingOverlay'
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

    if(opts.filterMode == 'channel')
      opts.filteringActive = (activeFilterCategories.length > 1);
    else
      opts.filteringActive = (activeFilterCategories.length > 0);

    // SEO link generationw
    var self = this;
    this.collection.each(function(filterModel){
      var qs_copy = JSON.parse(JSON.stringify(self.qs));

      if(!filterModel.get('isActiveFilter')){
        if (qs_copy.filter && qs_copy.filter.length) {
          qs_copy.filter.push(filterModel.get('name'));
        } else {
          qs_copy.filter = [filterModel.get('name')];
        }
      } else {
        if (qs_copy.filter) {
          qs_copy.filter.splice(qs_copy.filter.indexOf(filterModel.get('name')), 1);
        }
      }

      qs_copy.page = 1;
      qs_copy.filter = _.uniq(qs_copy.filter);
      if(qs_copy.filter.length === 0)
        delete qs_copy.filter;
      filterModel.attributes.filterLink = queryString.stringify(qs_copy);
    });

    return opts;
  },
  preRender: function () {
    var qs = this.qs = queryString.parse(utils.getCurrentUrlPath(this.app, false).split('?')[1]);
    if(qs.filter){
      if(!_.isArray(qs.filter)){
        qs.filter = [qs.filter];
      }
      this.activeFilters = qs.filter;
    } else {
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
