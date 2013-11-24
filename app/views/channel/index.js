var BaseView = require('../base_view');

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
  }
});

module.exports.id = "channel/index";
