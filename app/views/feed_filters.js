var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'filters',
  className: 'col-sm-2',
  events: {
    'click li' : 'filterItem'
  },
  filterItem: function (evt) {
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

  },
  getTemplateData: function () {

    var opts = this.options;
    //var queryObj = utils.getCurrentUrlQueryString(this.app);
    //console.log(queryObj);
    return opts;

  }
});

module.exports.id = "FeedFilters";
