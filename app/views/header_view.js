var BaseView = require('./base_view');
var LoginModal = require('./login_modal');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName:'header',
  postInitialize: function () {
    /// ATTN this is where the user is set on the app for all the other views
    /// until we find a better location.. since this is the first view initialize
    /// and it has the current user.
    this.app.user = this.model;
  },
  postHydrate: function () {
    // read long comment above, postHydrate - same reason for clientside
    this.app.user = this.model;
    this.listenTo(this.model, 'change:username', function () {
      //hack until TJ finds a subsetter location
      window.location.reload();
    });
    this.listenTo(this.model, 'change:gravitar', this.render.bind(this));
  },
  events: {
    'click #header-login-link' : 'openLogin',
    'click .dropdown-toggle' : 'toggleDropdown'
  },
  getTemplateData: function () {
    console.log(this.options);
    return {
      user: this.model.toJSON(),
      projectsCollection: this.options.context.projects
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