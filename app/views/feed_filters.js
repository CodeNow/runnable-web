var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');
var queryString = require('query-string');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'filters',
  className: 'col-md-2 col-sm-3',
  events: {
    'click li:not(.show-more)':       'filterItem',
    'click .show-more':               'showMore',
    'click [data-action="show-all"]': 'showAll'
  },
  activeFilters: [],
  qs: {},
  getTemplateData: function () {
    var opts = this.options;
    //var urlString = utils.getCurrentUrlPath(this.app, false);
    //console.log('urlString', urlString);
    return opts;
  },
  postRender: function () {
    var qs = this.qs = queryString.parse(location.search);
    if(qs.filter){
      if(!_.isArray(qs.filter)){
        qs.filter = [qs.filter];
      }
      this.activeFilters = qs.filter;
    } else {
      this.activeFilters = [];
    }
    this.updateActiveFilters();
  },
  showAll: function (evt) {
    this.activeFilters = [];
    delete this.qs.filter;
    this.updateActiveFilters();
    this.updateRoute();
  },
  updateRoute: function() {
    this.qs.page = 0;
    this.app.router.navigate(window.location.pathname + '?' + queryString.stringify(this.qs), {trigger: true});
  },
  filterItem: function (evt) {
    var name = this.$(evt.currentTarget).attr('data-name');
    if(this.activeFilters.indexOf(name) === -1){
      this.activeFilters.push(name);
      this.activeFilters = _.uniq(this.activeFilters, false);
    } else {
      this.activeFilters.splice(this.activeFilters.indexOf(name), 1);
    }
    this.qs.filter = this.activeFilters;
    if(this.activeFilters.length === 0){
      delete this.qs.filter;
      delete this.activeFilters;
    }
    this.updateRoute();
    this.updateActiveFilters();
  },
  updateActiveFilters: function () {
    // add 'ing' to 'filter' and show clear
    var $h3 = this.$('h3');
    if (this.activeFilters.length) {
      $h3.removeClass('out').addClass('in');
    } else {
      $h3.addClass('out').removeClass('in');
    }
    this.$el.find('li.active').removeClass('active');
    this.activeFilters.forEach(function(filterItem){
      this.$el.find('[data-name="' + filterItem + '"]').addClass('active');
    }, this);
  },
  showMore: function (evt) {
    var $ol = this.$('ol');

    if (!$ol.hasClass('in')) {
      $ol.addClass('in');
    }
  }
});

module.exports.id = "FeedFilters";
