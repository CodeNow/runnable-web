var BaseView = require('./base_view');
var _ = require('underscore');

// ATTN the purpose of this view is to ensure that the rootDir for the
// currently loading project has been fetched for its sub views.
// Important for push state navigation from any "project list" page
// to a "single project page"
module.exports = BaseView.extend({
  className:"code-container",
  events: {
    'click .btn-show-file-browser' : 'showFiles',
    'click .btn-hide-file-browser' : 'hideFiles'
  },
  postRender: function () {
    this.$showFilesButton = this.$('.btn-show-file-browser');
    this.$fileBrowser = this.$('.file-browser');
  },
  showFiles: function (evt) {
    this.$showFilesButton.hide();
    this.$fileBrowser.show();
  },
  hideFiles: function (evt) {
    this.$showFilesButton.show();
    this.$fileBrowser.hide();
  },
  getTemplateData: function () {
    // only rendered once.. passes through context
    return _.extend(this.options.context, this.options);
  }
});

module.exports.id = "CodeEditor";
