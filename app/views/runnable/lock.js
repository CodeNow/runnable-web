var BaseView = require('../base_view');
var SignupModal = require('../signup_modal');
var LockModal = require('../new_sign_up_modal');

module.exports = BaseView.extend({
  events: {
    'click .main-controls .run'      : 'run',
    'click .main-controls .savecopy' : 'saveCopy',
  },
  run: function () {
    this.triggerModal();
  },
  saveCopy: function () {
    this.triggerModal();
  },
  triggerModal: function () {
    var user = this.app.user;
    if (user.isRegistered()) {
      this.openLockModal();
    }
    else {
      var signupModal = new SignupModal({
        app    : this.app,
        onClose: this.stopListening.bind(this, user)
      });
      this.listenToOnce(user, 'auth', this.openLockModal.bind(this));
      signupModal.open();
    }
  },
  openLockModal: function () {
    var lockModal = new LockModal({ app:this.app });
    lockModal.open();
  }
});

module.exports.id = "runnable/lock";
