var BaseView = require('../base_view');
var utils = require('../../utils');

module.exports = BaseView.extend({
  events: {
    'change .selectpicker' : 'changeSort'
  },
  dontTrackEvents: ['change .selectpicker'],
  postRender: function () {
    // Enable Bootstrap-Select
    this.$('.selectpicker').selectpicker();
  },
  changeSort: function (evt) {
    this.trackEvent('Change Sort', {value:value});
    var value = $(evt.currentTarget).val();
    var path = utils.getCurrentUrlPath(this.app, true);
    this.app.router.navigate(path+'?sort='+value, true);
  },
  getTemplateData: function () {
    var opts = this.options;
    opts.sorts = [
      {
        value: 'created',
        label: 'Most Recent'
      },
      {
        value: 'views',
        label: 'Most Views'
      },
      {
        value: 'runs',
        label: 'Most Runs'
      }
    ];
    opts.selectedsort = utils.getQueryParam(this.app, 'sort') || 'created';
    return opts;
  }
});

module.exports.id = "channel/index";
