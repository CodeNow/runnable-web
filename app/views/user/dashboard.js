var BaseView = require('../base_view');
var _ = require('underscore');
var utils = require('../../utils');
function byCreated (a, b) {
  return (a.get('created') > b.get('created')) ?
    -1 : 1;
}

module.exports = BaseView.extend({
  events: {
    'click .nav-tabs a' : 'clickTab'
  },
  clickTab: function (evt) {
    this.$(evt.currentTarget).tab('show');
  },
  getTemplateData: function () {
    var opts = this.options;
    opts.verifiedUser = opts.user.isVerified();
    opts.draftsActive = !opts.verifiedUser || utils.isCurrentURL(this.app, '/me/drafts');
    opts.publishedActive = !opts.draftsActive;
    if (opts.drafts) opts.drafts.models.sort(byCreated);
    if (opts.published) opts.published.models.sort(byCreated)
    return this.options;
  }
});

module.exports.id = "user/dashboard";