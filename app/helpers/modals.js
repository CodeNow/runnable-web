var SignupModal = require('../views/signup_modal');

module.exports = {
  signup: function(callback){
    callback = (callback) ? callback : function(){};

    var user = this.app.user;

    var signupModal = new SignupModal({
      app:     this.app,
      onClose: callback
    });

    signupModal.open();

  }
};
