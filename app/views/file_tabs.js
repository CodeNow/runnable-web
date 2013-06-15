var BaseView = require('./base_view');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'nav',
  className: 'file-tabs',
  events: {
    'click li > a'          : 'tabClick',
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
  tabClick: function () {
    debugger;
  },
  tabClose: function () {

  }
});

module.exports.id = "FileTabs";
