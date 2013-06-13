var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'nav',
  className: 'file-tabs',
  postRender: function () {
    var files = this.model.openFiles; //collection
    return {
      files : files.toJSON(),
      selectedId: files.selectedFile().id
    };
  }
});

module.exports.id = "FileTabs";
