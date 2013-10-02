var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id: 'publish-request-modal',
  events: {
    'click .request-link' : 'close'
  }
});

module.exports.id = "NewSignUpModal";
