var ModalView = require('../modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id: 'register',
  defaultHeader: 'Register Default Header',
  getTemplateData: function () {
    this.options.messageBody = 'Default message body';
    return this.options;
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
  }
});

module.exports.id = "modals/registerModal";
