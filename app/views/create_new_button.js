var BaseView     = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'a',
  className: 'btn purple',
  attributes: {
    href: '/new'
  }

 /**
  * Disabling signup modal for unauthenticated users...
  */
 /*
  events: {
    click: 'click'
  },
  click: function (evt) {

    if (this.app.user.isRegistered()) {
      // let the link work...
    }
    else {
      evt.stopPropagation();
      evt.preventDefault();
      this.openLogin();
    }

  },
  openLogin: function () {
    var user = this.app.user;
    var router = this.app.router;
    var href = this.attributes.href;
    var signupModal = new SignupModal({
      app    : this.app,
      onClose: this.stopListening.bind(this, user)
    });
    this.listenToOnce(user, 'change:username', router.navigate.bind(router, href, {trigger:true}));
    signupModal.open();
  }
  */

});

module.exports.id = "CreateNewButton";
