var BaseView = require('./base_view');
// var router = require('../router');
var SignupModal = require('./signup_modal');

module.exports = BaseView.extend({
  tagName: 'button',
  className: 'btn-fork btn-tertiary',
  events: {
    'click' : 'click'
  },
  click: function () {
    if (this.app.user.isRegistered()) {
      this.disable(true);
      this.collection.saveAll(function (err) {
        this.disable(false);
        if (err) {
          this.showError(err);
        }
        else {
          this.app.router.navigate('/me/'+this.options.containerid, true);
        }
      }, this);
    } else {
      var signupModal = new SignupModal({ app:this.app });
      signupModal.open();
      return false; // stop link
    }
  }
});

module.exports.id = 'ForkButton';
