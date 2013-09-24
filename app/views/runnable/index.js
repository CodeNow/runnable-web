var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  getTemplateData: function () {
    var opts = this.options;
    opts.permissions = {
      edit: this.app.user.canEdit(opts.image)
    };
    return this.options;
  }
});

module.exports.id = "runnable/index";
