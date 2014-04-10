var ModalView = require('./modal_view');
var _ = require('underscore');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  id: 'contact-modal',
  events: {
    'click .silver' : 'dismiss'
  },
  postRender: function () {
    Super.postRender.apply(this, arguments);
    var formView = _.findWhere(this.childViews, {name:'contact_form'});
  },
  dismiss: function () {
    this.close();
  }
});

module.exports.id = "ContactModal";
