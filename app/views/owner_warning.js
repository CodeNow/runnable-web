var BaseView = require('./base_view');

module.exports = BaseView.extend({
  postHydrate: function () {
    var user = this.app.user;
    // needs to show hide on login/logout
    this.listenTo(user, 'change:permission_level', this.render.bind(this));
  },
  preRender: function () {
    var show = this.options.show = this.app.user.canEdit(this.model);
    this.className = show ? 'status-bar' : 'display-none';
  },
  getTemplateData: function () {
    this.options.user = this.app.user;
    return this.options;
  }
});

module.exports.id = "OwnerWarning";
