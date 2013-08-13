var EditorButtonView = require('./editor_button_view');
var Super = EditorButtonView.prototype;
// var router = require('../router');
var SignupModal = require('./signup_modal');

module.exports = EditorButtonView.extend({
  tagName: 'button',
  className: 'btn-fork btn-tertiary',
  events: {
    'click' : 'click'
  },
  preRender: function () {
    Super.preRender.call(this);
  },
  postHydrate: function () {
    Super.postHydrate.call(this);
  },
  click: function (evt) {
    evt.preventDefault();
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
    }
  }
});

module.exports.id = 'ForkButton';
