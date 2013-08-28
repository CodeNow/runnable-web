var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'lightbox',
  events: {
    'click .modal'      : 'stopPropagation',
    'click'             : 'close', // closes modal on bg click
    'click .btn-close'  : 'close',
  },
  postRender: function () {
    if ($('body').has(this.$el).length === 0) {
      $('body').append(this.$el);
    }
    this.$('input').eq(0).focus();
  },
  remove: function () {
    this.trigger('remove');
    Super.remove.apply(this, arguments);
  },
  open: function () {
    this.render();
  },
  close: function () {
    this.remove();
  },
  stopPropagation: function (evt) {
    evt.stopPropagation();
    //prevents closing modal when clicking inside modal
  }
});

module.exports.id = "ModalView";
