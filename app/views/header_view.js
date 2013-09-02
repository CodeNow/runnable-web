var BaseView = require('./base_view');
var LoginModal = require('./login_modal');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName:'header',
  id:'primary',
  postHydrate: function () {
    this.listenTo(this.model, 'change:gravitar', this.render.bind(this));
    this.listenTo(this.app, 'change:loading', this.loader.bind(this));
    this.loader(this.app, this.app.get('loading'));
  },
  events: {
    'click #header-login-link' : 'openLogin'
  },
  loader: function (model, loading) {
    console.log('loading', loading)
  },
  openLogin: function () {
    var loginModal = new LoginModal({ app:this.app });
    loginModal.open();
    return false; // stop link
  }
});

module.exports.id = 'HeaderView';