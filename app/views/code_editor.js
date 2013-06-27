var BaseView = require('./base_view');

// ATTN the purpose of this view is to ensure that the rootDir for the
// currently loading project has been fetched for its sub views.
// Important for push state navigation from any "project list" page
// to a "single project page"
module.exports = BaseView.extend({
  className:"code-container",
  postHydrate: function () {
    // clientside
    // postHydrate is the place to attach data events and frontend additional data retrieval
    if (this.model.rootDir.isNew()) {
      // this fetch is necessary when navigating from any "project list" page to a "single project page" (push state)
      // since rootDirectory is only returned with the project response from our single project api rest call.
      this.model.rootDir.fetch({
        success: function () {
          console.log("Got back from fetching the rootDir");
          console.dir(this.model.rootDir.contentsCollection);
          this.render();
        }.bind(this),
        error: function () {
          alert('Error fetching example files, please refresh page.');
        }
      });
    }
  },
  getTemplateData: function () {
    return {
      project : this.model,
      files : this.model.rootDir.contents()
    };
  }
});

module.exports.id = "CodeEditor";
