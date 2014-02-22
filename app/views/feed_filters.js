var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'filters',
  className: 'col-sm-3',
  events: {
    'click li' : 'filterItem'
  },
  filterItem: function (evt) {
    var self = this;
    var $ing = self.$('h3 > span');

    // mark as active
    self.$(evt.currentTarget).toggleClass('active');

    // add 'ing' to 'filter'
    if (self.$('li').hasClass('active')) {
      $ing.addClass('in');
    } else {
      $ing.removeClass();
    }
  }
});

module.exports.id = "FeedFilters";
