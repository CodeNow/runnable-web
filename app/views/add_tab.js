var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'div',
  id: 'add-tab',
  events: {
    'click' : 'togglePopover'
  },
  togglePopover: function () {
    var $self = this.$el;
    var $popover = this.$('.popover');

    if ($self.hasClass('active')) {
      $self.removeClass('active');
      $popover.removeClass('in');
    }
    else {
      $self.addClass('active');
      $popover.addClass('in');
    }
  }
});

module.exports.id = "AddTab";
