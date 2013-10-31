var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'btn-group',
  events: {
    'click .run-options' : 'togglePopover',
    'blur input'         : 'saveEffect'
  },
  togglePopover: function () {
    $('.popover').toggleClass('in');
  },
  saveEffect: function (evt) {
    var $input = $(evt.currentTarget);
    var $save = $input.next();
    $save.addClass('in');
    $input.on('focus',function(){
      $save.removeClass('in');
    });
  }
});

module.exports.id = "DropdownRunButton";
