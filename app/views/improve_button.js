var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName: 'div',
  id: 'improve-btn',
  className: 'btn-group',
  events: {
    'click'              : 'stopPropagation',
    'click .thumbs-up'   : 'thumbsUp',
    'click .thumbs-down' : 'thumbsDown'
  },
  postRender: function () {
    this.popover = _.findWhere(this.childViews, {name:'improve_popover'});
    // this.listenTo(this.popover, 'hide', this.unpress.bind(this));
    // this.listenTo(this.popover, 'show', this.press.bind(this));
  },
  stopPropagation: function (evt) {
    evt.stopPropagation();
  },
  thumbsUp: function (evt) {
    var thumbsUp = this.$('.thumbs-up');
    var thumbsDown = this.$('.thumbs-down');

    if (thumbsUp.hasClass('active')) {
      this.popover.hide();
    } else {
      this.popover.show();
    }

    thumbsDown.removeClass('active');
    thumbsUp.toggleClass('active');
  },
  thumbsDown: function (evt) {
    var thumbsUp = this.$('.thumbs-up');
    var thumbsDown = this.$('.thumbs-down');

    if (thumbsDown.hasClass('active')) {
      this.popover.hide();
    } else {
      this.popover.show();
    }

    thumbsUp.removeClass('active');
    thumbsDown.toggleClass('active');
  }
});

module.exports.id = "ImproveButton";
