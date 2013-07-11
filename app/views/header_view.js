var BaseView = require('./base_view');
var LoginModal = require('./login_modal');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName:'header',
  postHydrate: function () {
    this.listenTo(this.model, 'change:username', function () {
      //hack until TJ finds a subsetter location
      window.location.reload();
    });
    this.listenTo(this.model, 'change:gravitar', this.render.bind(this));
    this.listenTo(this.app, 'change:loading', this.loader.bind(this))
  },
  events: {
    'click #header-login-link' : 'openLogin',
    'click .dropdown-toggle' : 'toggleDropdown'
  },
  loader: function (model, loading) {
    var $loader = this.$('.logo-only');
    console.log($loader)
    if (loading) {
      $loader.addClass('loading');
    }
    else {
      $loader.removeClass('loading');
    }
  },
  getTemplateData: function () {
    return {
      user: this.model.toJSON()//,
      //projectsCollection: this.options.context.projects
    };
  },
  openLogin: function () {
    var loginModal = new LoginModal({ app:this.app });
    loginModal.open();
    return false; // stop link
  },
  toggleDropdown: function (evt, hide) {
    var $dropdownMenu = this.$('.dropdown-menu');
    if (hide || !$dropdownMenu.is(':hidden')) {
      $dropdownMenu.hide();
    }
    else {
      $dropdownMenu.show();
      if (evt) evt.stopPropagation();
      $(document).one('click', this.toggleDropdown.bind(this, null, true)); //hide on doc click
    }
  }
});

module.exports.id = 'HeaderView';