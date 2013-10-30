var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'btn-group',
  events: {
    'click run-options' : 'togglePopover'
  },
  togglePopover: function () {

  }
});

module.exports.id = "DropdownRunButton";
