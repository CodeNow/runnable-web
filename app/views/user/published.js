var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  getTemplateData: function () {
    return _.extend(this.options, {
      verified: this.options.user.isVerified()
    });
  }
});

module.exports.id = "user/published";