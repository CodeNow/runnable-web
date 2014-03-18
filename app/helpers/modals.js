var SignupModal = require('../views/signup_modal');
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
