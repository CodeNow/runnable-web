var BaseView = require('../base_view');
var utils = require('../../utils');

module.exports = BaseView.extend({
  events: {
    'click .nav-tabs a'       : 'clickTab',
    'click .delete-published' : 'deletePublished',
    'click .delete-drafts'    : 'deleteDrafts',
    // 'change select'           : 'changeSort'
  },
  clickTab: function (evt) {
    evt.preventDefault();
    var $a = this.$(evt.currentTarget);
    // var page = $a.attr('href').replace('#', '/');
    // this.app.router.navigate('/me'+page);
    $a.tab('show');
  },
  getTemplateData: function () {
    var opts = this.options;
    opts.verifiedUser = opts.user.isVerified();
    if (opts.editmode) {
      opts.draftsActive    = !opts.verifiedUser || this.options.published.length === 0;
      opts.publishedActive = !opts.draftsActive;
    }
    return this.options;
  },
  // changeSort: function () {
  //   _.find(this.childViews, {name:'dashboard_runnables'});

  // }
});

module.exports.id = "user/profile";
