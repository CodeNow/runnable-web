var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'div',
  className: 'popover fade bottom',
  show: function (el) {
    this.$el.addClass('in');
  },
  hide: function () {
    this.$el.removeClass('');
  }
});

module.exports.id = "RunPopover";