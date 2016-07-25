var BaseView = require('../base_view');
var modalHelpers = require('../../helpers/modals');
var utils = require('../../utils');

module.exports = BaseView.extend({
  id:'verifyMail',
  postRender: function () {
    var self = this;
    this.verifyUserMail();
  },
  verifyUserMail: function() {
    var self = this;
    var vUser = this.app.user.attributes.username;
    var eToken = this.app.user.attributes.etoken;
    this.app.user.verifyUserEmail( vUser, eToken, function (err) {
      if (err) {
        this.showError('We are not able to verify your request. Verify the link is correct or try again.');
      }
      else {
        window.location.href = "/?notify=email-changed";
      }
    }.bind(this));
  }
});

module.exports.id = "user/verifymail";