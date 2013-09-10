var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  events: {
    'keyup input' : 'search',
    'blur input'  : 'clear'
  },
  dontTrackEvents: ['blur input'],
  className: 'search-bar',
  postRender: function () {
    this.resultsView = _.findWhere(this.childViews, {name:'search_results'});
  },
  search: function (evt) {
    var text = $(evt.currentTarget).val();
    this.resultsView.search(text);
  },
  clear: function (evt) {
    this.$(evt.currentTarget).val('');
    this.resultsView.clear();
  }
});

module.exports.id = 'SearchBarView';
