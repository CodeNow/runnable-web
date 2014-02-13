var SignupModal = require('../views/signup_modal');

module.exports = {
  signup: function(callback){
    callback = (callback) ? callback : function(){};

    var user   = this.app.user,
        router = this.app.router,
        href   = window.location.pathname;

    var signupModal = new SignupModal({
      app:     this.app,
      onClose: callback //this.stopListening.bind(this, user)
    });

    //this.listenToOnce(user, 'change:username', router.navigate.bind(router, href, {trigger: true}));
    signupModal.open();

  }
};
