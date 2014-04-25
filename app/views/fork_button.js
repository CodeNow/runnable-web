var EditorButtonView = require('./editor_button_view');
var Super = EditorButtonView.prototype;
var utils = require('../utils');
var async = require('async');
// var router = require('../router');
var SignupModal = require('./signup_modal');

module.exports = EditorButtonView.extend({
  tagName: 'button',
  className: 'green',
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
    var user = this.app.user;
    var dispatch = this.app.dispatch;
    if (user.isRegistered()) {
      this.saveAndRedirect();
    }
    else {
      var signupModal = new SignupModal({
        app    : this.app,
        onClose: this.stopListening.bind(this, user)
      });
      this.listenToOnce(user, 'auth', this.saveAndRedirect.bind(this));
      signupModal.open();
    }
  },
  saveAndRedirect: function () {
    var self = this;
    self.disable(true);
    self.app.set('loading', true);
    async.parallel([
      self.collection.saveAll.bind(self.collection),
      function (cb) {
        var opts = utils.cbOpts(cb);
        self.model.save({ saved:true }, opts);
      }
    ],
    function done (err) {
      if (err) {
        self.disable(false);
        self.app.set('loading', false);
        self.showError(err);
      }
      else {
        self.app.router.navigate('/me/'+self.options.model.id, true);
      }
    });
  }
});

module.exports.id = 'ForkButton';
