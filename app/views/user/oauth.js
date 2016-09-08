var BaseView = require('../base_view');
var modalHelpers = require('../../helpers/modals');
var utils = require('../../utils');


module.exports = BaseView.extend({
  id:'oauth',
  postRender: function () {
    var self = this;
    if(self.app.user.isRegistered()){
      self.$('#oauthMsgTitle').html("Hang on tight..");
      self.$('#oauthMsg').html("Authenticating your account.");
    }
    this.login();
  },
  login: function () {
    var self = this;

    if(self.app.user.isRegistered()){
      self.redirectToAuth();
    } else {
      modalHelpers.login.call(self, function(){
        if(self.app.user.isRegistered()){
          self.redirectToAuth();
        }
      });
    }
  },
  redirectToAuth: function () {
    var clientSSO = utils.getQueryParam(this.app, 'sso');
    var clientSig = utils.getQueryParam(this.app, 'sig');
    window.location.href = "/oauth/oauthorize?sso=" + clientSSO + "&sig=" + clientSig;
  }
});

module.exports.id = "user/oauth";
