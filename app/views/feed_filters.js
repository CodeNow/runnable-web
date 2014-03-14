var BaseView = require('./base_view');
var utils = require('../utils');
var _ = require('underscore');
var queryString = require('query-string');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'filters',
  className: 'col-md-2 col-sm-3',
  events: {
    'click li' : 'filterItem'
  },
  activeFilters: [],
  qs: {},
  postRender: function () {
    var qs = this.qs = queryString.parse(location.search);
    if(qs.filter){
      this.activeFilters = (_.isArray(qs.filter)) ? qs.filter : [];
      this.updateActiveFilters();
    }
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
    this.app.router.navigate(window.location.pathname + '?' + queryString.stringify(this.qs));

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
  getTemplateData: function () {

    var opts = this.options;
    //var queryObj = utils.getCurrentUrlQueryString(this.app);
    //console.log(queryObj);
    return opts;

  }
});

module.exports.id = "FeedFilters";
