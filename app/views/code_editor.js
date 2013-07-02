var BaseView = require('./base_view');

// ATTN the purpose of this view is to ensure that the rootDir for the
// currently loading project has been fetched for its sub views.
// Important for push state navigation from any "project list" page
// to a "single project page"
module.exports = BaseView.extend({
  className:"code-container",
  getTemplateData: function () {
    return {
      project : this.model,
      files : this.model.rootDir.contents()
    };
  }
});

module.exports.id = "CodeEditor";
