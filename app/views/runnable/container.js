var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  postHydrate: function () {
    this.listenTo(this.app.user, 'change:_id', this.render.bind(this));
  },
  getTemplateData: function () {
    return _.extend(this.options, {
      isVerified: this.options.user.isVerified()
    });
  },
});

module.exports.id = "runnable/container";
