var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'li',
  getTemplateData: function () {
    this.options.moderatormode = this.options.app.user.isModerator();
    this.options.userverified = this.options.app.user.isVerified();
    return this.options;
  }
});

module.exports.id = "RunnableFeedItem";

