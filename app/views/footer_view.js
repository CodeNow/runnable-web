var BaseView = require('./base_view');
var ContactModal = require('./contact_modal');

module.exports = BaseView.extend({
  tagName: 'footer',
  id: 'site-credits',
  events: {
    'click .contact' : 'openContactModal'
  },
  openContactModal: function (evt) {
    evt.preventDefault();
    var contactModal = new ContactModal({app:this.app});
    contactModal.open();
  },
  getTemplateData: function () {
    var opts = this.options;
    opts.domain = this.app.get('domain');
    return opts;
  }
});

module.exports.id = 'FooterView';