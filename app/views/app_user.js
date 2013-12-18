var BaseView = require('./base_view');

/// ATTN this is where the user is set on the app for all the other views
/// until we find a better location.. since this is the first view initialize
/// and it has the current user.

module.exports = BaseView.extend({
  className: "display-none",
  postInitialize: function () {
    if (this.options.model) {
      this.app.user = this.options.model;
      console.log("HeaderView postInitialize this.app.user", this.app.user.id);
    }
  },
  postHydrate: function () {
    // read long comment above, postHydrate - same reason for clientside
    if (this.options.model) {
      this.app.user = this.options.model;
      this.app.user.set('referrer', document.referrer);
      console.log("HeaderView postHydrate this.app.user", this.app.user.id);
    }
  },
  postRender: function () {
    if (!window.viewControllingIntercom) {
      window.viewControllingIntercom = true;
      var user = this.app.user;
      if (!user.isRegistered()) {
        this.listenToOnce(user, 'auth', function () {
          Track.initIntercom(user.toJSON());
          Track.user(user.toJSON());
        });
      }
    }
  }
});

module.exports.id = "AppUser";
