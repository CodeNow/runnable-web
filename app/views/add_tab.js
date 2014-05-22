var BaseView = require('./base_view');

module.exports = BaseView.extend({
  id: 'add-tab',
  className: 'btn-popover',
  events: {
    'click' : 'togglePopover'
  },
  togglePopover: function (evt) {
    var $self = this.$el;
    var $popover = this.$('.popover');

    evt.stopPropagation();

    $('.popover').removeClass('in');

    if ($self.hasClass('active')) {
      $('.btn-popover').removeClass('active');
      $popover.removeClass('in show-shortcuts show-new-shortcut');
    }
    else {
      $self.addClass('active');
      $popover.addClass('in');
    }
  }
});

module.exports.id = "AddTab";
