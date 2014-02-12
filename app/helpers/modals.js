var SignupModal = require('../views/signup_modal');

module.exports = {
  signup: function(){
    var user   = this.app.user,
        router = this.app.router,
        href   = this.attributes.href;

    var signupModal = new SignupModal({
      app:     this.app,
      onClose: this.stopListening.bind(this, user)
    });

    this.listenToOnce(user, 'change:username', router.navigate.bind(router, href, {trigger: true}));
    signupModal.open();

  }
};
