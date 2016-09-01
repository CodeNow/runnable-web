var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'ul',
  id: 'active-users-list',
  events: {
    // 'click .killBtn'      : 'killContainer'
  },
  postRender: function () {
    this.loading(true);
    // this.$('a.termBtn').attr('href', this.options.termurl);
  },
  getTemplateData: function () {
    this.options.isUserVerified = this.app.user.isVerified();
    this.options.userContentDomain = this.app.get('userContentDomain');
    return this.options;
  },
  killContainer: function (evt) {
    console.log('@@@@@', this);
    var self = this;
    evt.preventDefault();

    this.app.container.killContainer(containerID, function (err) {
      if (err) {
        this.showError(err);
      }
      else {
        // userSession.logoutUrl + userSession.containerID + "/killMe"
        this.showNotification('The container has been killed successfully.');
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

module.exports.id = "ActiveUserFeed";