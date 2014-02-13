var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  className: 'btn-group',
  events: {
    'click .run-options' : 'togglePopover'
  },
  postRender: function () {
    this.popover = _.findWhere(this.childViews, {name:'run_popover'});
    this.listenTo(this.popover, 'hide', this.unpress.bind(this));
    this.listenTo(this.popover, 'show', this.press.bind(this));
  },
  togglePopover: function () {
    if (this.$('.run-options').hasClass('active')) {
      this.popover.hide();
    }
    else {
      this.popover.show();
    }
  },
  press: function () {
    this.$('.run-options').addClass('active');
  },
  unpress: function () {
    this.$('.run-options').removeClass('active');
  }
});

module.exports.id = "DropdownRunButton";
