var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName: 'span',
  postHydrate: function () {
    // clientside
    // postHydrate is the place to attach data events
    this.path = this.options.path || '/';
    this.dir = this.model.rootDir.getPath(this.path);
  },
  getTemplateData: function () {
    // be careful postHydrate has only been called before frontend render but not backend!
    // this means, the only data you can rely on is this.model and this.options binded to this view.
    this.path = this.options.path || '/';
    this.fs = this.model.rootDir.getPath(this.path);
    return {
      fsJSON: this.fs.toJSON(),
      projectJSON: this.model.toJSON(),
      isRoot: this.fs.isRootDir()
    };
  }
});

module.exports.id = "FileTreeItem";
