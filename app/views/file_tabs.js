var BaseView = require('./base_view');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'nav',
  className: 'file-tabs',
  postInitialize: function () {
    // this function is being invoked twice - once when not attached to dom...?
    if (this.parentView)
      this.openFiles = this.model.openFiles;
  },
  getTemplateData: function () {
    return {
      files : this.model.openFiles.toJSON()
    };
  }
});

module.exports.id = "FileTabs";
