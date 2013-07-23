var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  getTemplateData: function () {
    console.log(this.options);
    return this.options;
  }
});

module.exports.id = "user/drafts";