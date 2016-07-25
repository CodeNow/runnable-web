var BaseView = require('../base_view');
var modalHelpers = require('../../helpers/modals');
var utils = require('../../utils');


module.exports = BaseView.extend({
  id:'verify',
  postRender: function () {
    var self = this;
    this.verifyUser();
  },
  verifyUser: function() {
    var self = this;
    var vUser = this.app.user.attributes.username;
    var vToken = this.app.user.attributes.vtoken;
    this.app.user.verifyUser( vUser, vToken, function (err) {
      if (err) {
        this.showError('We are not able to verify your request. Verify the link is correct or try to resend confirmation mail by logging in into your account.');
      }
      else {
        window.location.href = "/?notify=email-verified";
      }
    }.bind(this));
  }
});

module.exports.id = "user/verify";
