var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'div',
  className: 'btn-group improve-btn',
  events: {
    'click .silver' : 'togglePopover'
  },
  togglePopover: function () {
    this.$('.popover').toggleClass('in');
  }
});

module.exports.id = "ImproveButton";
