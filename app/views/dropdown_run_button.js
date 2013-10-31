var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'btn-group',
  events: {
    'click .run-options' : 'togglePopover'
  },
  togglePopover: function () {
    $('.popover').toggleClass('in');
  }
});

module.exports.id = "DropdownRunButton";
