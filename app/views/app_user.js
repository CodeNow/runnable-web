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
    if (!window.appUserOnce) {
      // there are multiple app_user views
      // but we only want this logic to be called once..
      window.appUserOnce = true;
      var user = this.app.user;
      if (!user.isRegistered()) {
        this.listenToOnce(user, 'auth', function () {
          Track.initIntercom(user.toJSON());
          Track.user(user.toJSON());
        });
      }
      // optimally, we want to save initial referrer on creation of new anon user.
      // unfortunately, referrer is not in the 'request' serverside. so we have this
      // logic here check if the user_model has a just_created property, and save
      // the just created user's initial_referrer
      var user = this.app.user;
      if (user.get('just_created')) {
        user.save({
          initial_referrer: document.referrer
        }, { patch:true }); //ignore errors..
      }
    }
  }
});

module.exports.id = "AppUser";
