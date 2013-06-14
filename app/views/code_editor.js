var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className:"code-container",
  postRender: function () {
    /// Beware: Fragile code ahead.
    /// Beware: Fragile code ahead.
    if (!this.clientSide) { // first render clientside only..
      // first client side postRender
      var view = this;
      this.clientSide = true;
      this.model.rootDir.fetch({
        success: function () {
          view.render(); // this pull will populate openFiles auto (in project constructor).
        },
        error: function () {
          alert('Error, please refresh page.');
        }
      });
    }
  },
  getTemplateData: function () {
    return {
      clientSide : this.clientSide,
      project    : this.model
    };
  }
});

module.exports.id = "CodeEditor";
