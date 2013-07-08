var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName:'li',
  events: {
    'click a'           : 'select',
    'click .close-file' : 'close'
  },
  postInitialize: function () {
    var file = this.options.model;
    if (file && file.get('selected')) {
      this.className = 'selected';
    }
  },
  postHydrate: function () {
    // change:selected is listened to in file_tabs
    console.log(this.model.id);
    this.listenTo(this.model, 'change:name', this.render.bind(this));
  },
  select: function () {
    this.model.set('selected', true);
  },
  close: function () {
    // note! you cannot rely on this.model.collection to be openFiles
    // since the model belongs to two collection (folderFile, openFiles)
    // it could point to either.
    this.parentView.collection.remove(this.model);
  }
});

module.exports.id = "FileTab";
