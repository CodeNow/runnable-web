var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'filters',
  className: 'col-md-2 col-sm-3',
  events: {
    'click .show-more'    : 'showMore',
    'click li'            : 'filterItem'
  },
  getTemplateData: function () {
    var opts = this.options;
    //var queryObj = utils.getCurrentUrlQueryString(this.app);
    //console.log(queryObj);
    return opts;
  },
  showMore: function (evt) {
    var $ol = this.$('ol');

    if (!$ol.hasClass('in')) {
      $ol.addClass('in');
    }
  },
  filterItem: function (evt) {
    // if li is not :last-child
    if (!$(evt.currentTarget).hasClass('show-more')) {
      var self = this;
      var $h3 = self.$('h3');

      // mark as active
      self.$(evt.currentTarget).toggleClass('active');

      // add 'ing' to 'filter' and show clear
      if (self.$('li').hasClass('active')) {
        $h3.removeClass('out').addClass('in');
      } else {
        $h3.addClass('out').removeClass('in');
      }
    }
  }
});

module.exports.id = "FeedFilters";
