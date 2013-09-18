var BaseView = require('../base_view');
var _ = require('underscore');
var utils = require('../../utils');

module.exports = BaseView.extend({
  events: {
    'click .nav-tabs a' : 'clickTab',
    'click .delete-published' : 'deletePublished',
    'click .delete-drafts'    : 'deleteDrafts'
  },
  clickTab: function (evt) {
    this.$(evt.currentTarget).tab('show');
  },
  getTemplateData: function () {
    var opts = this.options;
    opts.verifiedUser = opts.user.isVerified();
    opts.draftsActive = !opts.verifiedUser || utils.isCurrentURL(this.app, '/me/drafts');
    return this.options;
  }
});

module.exports.id = "user/dashboard";