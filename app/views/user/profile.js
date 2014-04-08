var BaseView = require('../base_view');
var utils = require('../../utils');

module.exports = BaseView.extend({
  events: {
    'click .toggles button'   : 'clickTab',
    'click .delete-published' : 'deletePublished',
    'click .delete-drafts'    : 'deleteDrafts'
  },
  clickTab: function (evt) {
    evt.preventDefault();
    this.$('.toggles > button').toggleClass('active');
    this.$('.runnable-feed').toggleClass('in');
  },
  getTemplateData: function () {
    var opts = this.options;
    opts.verifiedUser = opts.user.isVerified();
    if (opts.editmode) {
      opts.draftsActive    = !opts.verifiedUser || this.options.published.length === 0;
      opts.publishedActive = !opts.draftsActive;
    }
    return this.options;
  }
});

module.exports.id = "user/profile";
