var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  postHydrate: function () {
    this.listenTo(this.app.user, 'change:_id', this.render.bind(this));
  },
  getTemplateData: function () {
    var opts = this.options;
    return _.extend(opts, {
      isVerified   : this.app.user.isVerified(),
      specification: opts.specifications.get(opts.container.get('specification'))
    });
  },
  postRender: function () {
    
    this.childViewContainer = _.findWhere(this.childViews, {name: 'terminal'}).model;
    
    // Set User Session values
    var container = this.childViewContainer;
    var userSessionConfigs = this.app.get('userSession');

    userSession.containerID = container.id;
    userSession.inactiveTimeout = userSessionConfigs.inactiveTimeout;
    userSession.warningTimeout = userSessionConfigs.warningTimeout;
    userSession.minWarning = userSessionConfigs.minWarning;
    userSession.maxSessionTimer = userSessionConfigs.maxSessionTimer;
    userSession.keepaliveUrl = userSessionConfigs.keepaliveUrl;
    userSession.keepaliveInterval = userSessionConfigs.keepaliveInterval;

    $.idleTimer(userSession.inactiveTimeout);

    userSession.keepaliveTimer = setInterval(function () {
        userSession.keepAlive();
    }, userSession.keepaliveInterval);
  }
});

module.exports.id = "runnable/container";
