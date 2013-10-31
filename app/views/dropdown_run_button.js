var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'btn-group',
  events: {
    'click .run-options' : 'togglePopover'
  },
  togglePopover: function () {
    this.$('.run-options').toggleClass('active');
    this.$('.popover').toggleClass('in');
  }
});

module.exports.id = "DropdownRunButton";
