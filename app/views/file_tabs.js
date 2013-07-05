var BaseView = require('./base_view');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'nav',
  className: 'file-tabs',
  events: {
    'click li > a:not(.selected)'          : 'tabClick',
    'click .close-file'     : 'tabClose'
  },
  postHydrate: function() {
    // postHydrate is the place to attach data events
    var openFiles = this.model.openFiles;
    var self = this;
    this.listenTo(openFiles, 'add remove change', this.render.bind(this));
    openFiles.on('select:file', this.render.bind(this));
    this.model.rootDir.on('change:contents',  this.render.bind(this));
  },

  getTemplateData: function () {
    // be careful postHydrate has only been called before frontend render but not backend!
    // this means, the only data you can rely on is this.model and this.options binded to this view.

    if (this.model.openFiles.selectedFile) {
      return {
        files : this.model.openFiles.toJSON(),
        selectedFile: this.model.openFiles.selectedFile.get("path")
      };
    } else {
      return {
        files : null,
        selectedFile: null
      };
    }
  },
  tabClick: function (evt) {
    this.$el.removeClass('selected');
    var fileId = $(evt.currentTarget).data('id');
    this.model.openFiles.selectedFile(fileId);
    Track.event('File Tabs View', 'Selected File', {
      file     :fileId,
      projectId:this.model.id
    });
  },
  tabClose: function (evt) {
    evt.stopPropagation();
    var fileId = $(evt.currentTarget).data('id');
    var fileModel = this.model.openFiles.get(fileId);
    this.model.openFiles.remove(fileModel);
    Track.event('File Tabs View', 'Closed File', {
      file     : fileId,
      projectId: this.model.id
    });
  }
});

module.exports.id = "FileTabs";
