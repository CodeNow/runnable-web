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
  }
});

module.exports.id = "runnable/container";
