var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName: 'span',
  getTemplateData: function () {
    var fs = this.options.fs;
    return _(fs.toJSON()).extend({
      isRoot: fs.isRootDir(),
      projectName: fs.project.get('name')
    });
  }
});

module.exports.id = "FileTreeItem";
