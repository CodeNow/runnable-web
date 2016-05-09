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
    userSession.inactiveTimeout = userSessionConfigs.inactiveTimeout * 1000;
    userSession.warningTimeout = userSessionConfigs.warningTimeout * 1000;
    userSession.minWarning = userSessionConfigs.minWarning * 1000;
    userSession.maxSessionTimer = userSessionConfigs.maxSessionTimer * 1000;
    userSession.keepaliveInterval = userSessionConfigs.keepaliveInterval * 1000;
    userSession.keepaliveUrl = userSessionConfigs.keepaliveUrl;

    $('#inactiveSessionLimit').html(userSessionConfigs.inactiveTimeout/60);
    $('#maxGuestSessionLimit').html(userSessionConfigs.maxSessionTimer/60);

    $.idleTimer(userSession.inactiveTimeout);

    userSession.keepaliveTimer = setInterval(function () {
        userSession.keepAlive();
    }, userSession.keepaliveInterval);
  }
});

module.exports.id = "runnable/container";
