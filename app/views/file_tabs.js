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
    this.listenTo(openFiles, 'add remove change', this.render.bind(this));
  },
  getTemplateData: function () {
    // be careful postHydrate has only been called before frontend render but not backend!
    // this means, the only data you can rely on is this.model and this.options binded to this view.
    return {
      files : this.model.openFiles.toJSON()
    };
  },
  tabClick: function (evt) {
    this.$el.removeClass('selected');
    var fileId = $(evt.currentTarget).data('id');
    this.fileCollection.selectedFile(fileId);
    Track.event('File Tabs View', 'Selected File', {
      file     :fileId,
      projectId:this.projectModel.id
    });
  },
  tabClose: function () {
    evt.stopPropagation();
    var fileId = $(evt.currentTarget).data('id');
    var fileModel = this.fileCollection.get(fileId);
    this.fileCollection.remove(fileModel);
    Track.event('File Tabs View', 'Closed File', {
      file     : fileId,
      projectId: this.projectModel.id
    });
  }
});

module.exports.id = "FileTabs";
