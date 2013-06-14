var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'li',
  className: 'folder',
  postInitialize: function () {
    // this function is being invoked twice - once when not attached to dom...?
    if (!this.parentView) return;

    if (this.model) {
      // root file tree, model is project
      this.dir = this.model.rootDir;
    }
    else {
      this.dir = this.options.dir;
    }
  },
  getTemplateData: function () {
    return {
      dir: this.dir,
      contents: this.dir.get('contents') && this.dir.collection().toArray()
    };
  },
  postRender: function () {
    if (this.dir.get('open'))
      this.$el.addClass('open');
  }
});

module.exports.id = "FileTree";
