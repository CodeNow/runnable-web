var SignupModal = require('../views/signup_modal');
var LoginModal = require('../views/login_modal');
var DownloadMsgModal = require('../views/download_message_modal');

module.exports = {
  signup: function(callback){
    callback = (callback) ? callback : function(){};

    var user = this.app.user;

    var signupModal = new SignupModal({
      app:     this.app,
      onClose: callback
    });

    signupModal.open();

  },
  login: function(callback){
    callback = (callback) ? callback : function(){};

    var user = this.app.user;

    var loginModal = new LoginModal({
      app:     this.app,
      onClose: callback
    });

    loginModal.open();

  },
  saveProjectMessage: function (cb) {
    cb = (cb) ? cb : function () {};
    var user = this.app.user;
    var downloadModal = new DownloadMsgModal({
    	app: this.app,
    	onClose: cb
    });
    downloadModal.open();
  }
};
