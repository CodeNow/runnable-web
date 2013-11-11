var BaseView = require('../base_view');
var _ = require('underscore');
var utils = require('../../utils');

module.exports = BaseView.extend({
  events: {
    'click .nav-tabs a'       : 'clickTab',
    'click .delete-published' : 'deletePublished',
    'click .delete-drafts'    : 'deleteDrafts',
    'change select'           : 'reSort',
    'click .edit-inline' : 'editInline'
  },
  clickTab: function (evt) {
    evt.preventDefault();
    var $a = this.$(evt.currentTarget);
    var page = $a.attr('href').replace('#', '/');
    this.app.router.navigate('/me'+page);
    $a.tab('show');
  },
  getTemplateData: function () {
    var opts = this.options;
    opts.verifiedUser = opts.user.isVerified();
    opts.draftsActive = !opts.verifiedUser || utils.isCurrentURL(this.app, '/me/drafts');
    opts.publishedActive = !opts.draftsActive;
    return this.options;
  },
  reSort: function () {
    this.$('.filter-option').text($('select')[0].value);
  },
  editInline: function (evt) {
    var $thisInput = this.$(evt.currentTarget)
      .children('input')
      .focus();
  }
});

module.exports.id = "user/dashboard";