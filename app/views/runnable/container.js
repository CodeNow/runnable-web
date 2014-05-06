var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  id: 'runnable',
  postHydrate: function () {
    this.listenTo(this.app.user, 'change:_id', this.render.bind(this));
    this.app.dispatch.on('toggle:preview', this.toggle_preview.bind(this));
  },
  toggle_preview: function (previewBool) {
    if (previewBool) {
      this.$el.find('#project-details-edit').hide();
      this.$el.find('#project-details-preview').show();
    } else {
      this.$el.find('#project-details-edit').show();
      this.$el.find('#project-details-preview').hide();
    }
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
