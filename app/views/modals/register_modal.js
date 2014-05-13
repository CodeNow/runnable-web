var ModalView = require('../modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id: 'register-modal',
  events: {
    'click a' : 'flip'
  },
  postInitialize: function () {
    this.options.header = this.options.header || this.defaultHeader;
    this.onClose = this.options.onClose;
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  remove: function () {
    if(this.onClose)
      this.onClose();
    Super.remove.apply(this, arguments);
  },
  flip: function () {
    this.$el.toggleClass('flip');
  }
});

module.exports.id = "modals/registerModal";
