var BaseView = require('../base_view');
var utils = require('../../utils');

module.exports = BaseView.extend({
  events: {
    'click .toggles button'   : 'clickTab',
    'click .delete-published' : 'deletePublished',
    'click .delete-drafts'    : 'deleteDrafts',
    'click #removeNotice'     : 'removeNotice',
    'click #sendVerification' : 'sendVerifyMail'
  },
  clickTab: function (evt) {
    evt.preventDefault();
    this.$('.toggles > button').toggleClass('active');
    this.$('.runnable-feed').toggleClass('in');
  },
  getTemplateData: function () {
    var opts = this.options;
    opts.verifiedUser = opts.user.isVerified();
    if (opts.editmode) {
      opts.draftsActive    = !opts.verifiedUser || this.options.published.length === 0;
      opts.publishedActive = !opts.draftsActive;
    }
    return this.options;
  },
  removeNotice: function () {
    $("#dashboardTop").hide('slow');
    $("#dashboardTop").hide('slow');
  },
  sendVerifyMail: function() {
    var user = this.app.user;
    this.app.user.sendVerificationMail( function (err) {
        if (err) {
          this.showError(err);
        }
        else {
          this.showNotification('Verification link has been sent to reigstered email.');
        }
      }.bind(this));
  },
  showNotification: function (notifyMsg) {
    setTimeout( function() {
      // create the notification
      var notification = new NotificationFx({
        message : '<span class="glyphicons bullhorn"></span><span><p class="notificationMsg">' + notifyMsg + '</p></span>',
        layout : 'bar',
        effect : 'slidetop',
        ttl : 8000,
        type : 'notice' // notice, warning or error
      });
      // show the notification
      notification.show();
    }, 1000 );
  }
});

module.exports.id = "user/profile";
