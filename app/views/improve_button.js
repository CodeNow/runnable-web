var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName: 'div',
  id: 'improve-btn',
  className: 'btn-group',
  events: {
    'click .silver' : 'togglePopover'
  },
  postRender: function () {
    this.popover = _.findWhere(this.childViews, {name:'improve_popover'});
    this.listenTo(this.popover, 'hide', this.unpress.bind(this));
    this.listenTo(this.popover, 'show', this.press.bind(this));
  },
  togglePopover: function () {
    if (this.$('.silver').hasClass('active')) {
      this.popover.hide();
    }
    else {
      this.popover.show();
    }
  },
  press: function () {
    this.$('.silver').addClass('active');
  },
  unpress: function () {
    this.$('.silver').removeClass('active');
  }

});

module.exports.id = "ImproveButton";
