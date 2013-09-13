var BaseView = require('./base_view');
var LoginModal = require('./login_modal');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName:'header',
  id:'primary',
  events: {
    'click #header-login-link' : 'openLogin'
  },
  openLogin: function () {
    var loginModal = new LoginModal({ app:this.app });
    loginModal.open();
    return false; // stop link
  }
});

module.exports.id = 'HeaderView';