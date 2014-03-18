var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id: 'download_message',
  defaultHeader: "Download Project",
  postInitialize: function () {
    this.options.header = this.options.header || this.defaultHeader;
    this.onClose = this.options.onClose;
  },
  events: {
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
  },
  remove: function () {
    if (this.onClose)
      this.onClose();
    Super.remove.apply(this, arguments);
  }
});

module.exports.id = "downloadMessageModal";
