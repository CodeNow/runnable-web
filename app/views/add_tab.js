var BaseView = require('./base_view');

module.exports = BaseView.extend({
  id: 'add-tab',
  className: 'btn-popover',
  events: {
    'click' : 'togglePopover'
  },
  hidePopover: function () {
    $('.btn-popover').removeClass('active');
    $('.popover').removeClass('show-add-repo show-form in');

    // unbind when popover is closed
    $('body').off('click', this.hidePopover);
  },
  togglePopover: function (evt) {
    var $body = $('body');
    var $self = this.$el;
    var $popover = this.$('.popover');

    evt.stopPropagation();

    $('.popover').removeClass('in');

    if ($self.hasClass('active')) {
      $('.btn-popover').removeClass('active');
      $popover.removeClass('in show-new-shortcut');

      // unbind when popover is closed
      $body.off('click', this.hidePopover);
    }
    else {
      this.hidePopover();
      $self.addClass('active');
      $popover.addClass('in');

      // bind when popover is open
      $body.on('click',{thisView : this}, this.hidePopover);
    }
  }
});

module.exports.id = "AddTab";
