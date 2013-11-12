var BaseView = require('./base_view');
var LoginModal = require('./login_modal');
var SignupModal = require('./signup_modal');
var PublishRequestModal = require('./publish_request_modal');

module.exports = BaseView.extend({
  tagName: 'ul',
  className: 'nav nav-pills',
  events: {
    'click #header-login-link'  : 'openLogin',
    'click #header-signup-link' : 'openSignup',
    'click #user-info'          : 'toggleUserInfo'
  },
  postHydrate: function () {
    this.listenTo(this.model, 'change:username', this.render.bind(this));
  },
  openLogin: function (evt) {
    evt.preventDefault();
    var loginModal = new LoginModal({ app:this.app });
    loginModal.open();
  },
  openSignup: function (evt) {
    evt.preventDefault();
    var signupModal = new SignupModal({ app:this.app });
    signupModal.open();
  },
  toggleUserInfo: function () {
    this.$('#user-info').toggleClass('in');
  }
});

module.exports.id = "HeaderActions";
