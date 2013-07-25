var BaseView = require('./base_view');
var _ = require('underscore');

// ATTN the purpose of this view is to ensure that the rootDir for the
// currently loading project has been fetched for its sub views.
// Important for push state navigation from any "project list" page
// to a "single project page"
module.exports = BaseView.extend({
  className:"code-container",
  events: {
    'click .btn-show-file-browser' : 'showFiles',
    'click .btn-hide-file-browser' : 'hideFiles',
    'click .btn-file-options'      : 'showFileMenu'
  },
  postRender: function () {
    this.$showFilesButton = this.$('.btn-show-file-browser');
    this.$fileBrowser = this.$('.file-browser');
    this.codeView = _.findWhere(this.childViews, {name:'code'});
    this.showFiles();
  },
  postHydrate: function () {
    var model = this.model;
    var canEdit = this.app.user.canEdit(model);
    if (!canEdit) {
      var views = model.get('views') + 1;
      model.set('views', views);
      model.save({}, {
        url: '/runnables/' +
          model.id +
          '/stats/views',
        method: 'post'
      });
    }
    this.app.dispatch.on('copy', function () {
      if (!canEdit) {
        var copies = model.get('copies') + 1;
        model.set('copies', copies);
        model.save({}, {
          url: '/runnables/' +
            model.id +
            '/stats/copies',
          method: 'post'
        });
      }
    });
    this.app.dispatch.on('paste', function () {
      if (!canEdit) {
        var pastes = model.get('pastes') + 1;
        model.set('pastes', pastes);
        model.save({}, {
          url: '/runnables/' +
            model.id +
            '/stats/pastes',
          method: 'post'
        });
      }
    });
    this.app.dispatch.on('cut', function () {
      if (!canEdit) {
        var cuts = model.get('cuts') + 1;
        model.set('cuts', cuts);
        model.save({}, {
          url: '/runnables/' +
            model.id +
            '/stats/cuts',
          method: 'post'
        });
      }
    });
    this.app.dispatch.on('run', function () {
      if (!canEdit) {
        var runs = model.get('runs') + 1;
        model.set('runs', runs);
        model.save({}, {
          url: '/runnables/' +
            model.id +
            '/stats/runs',
          method: 'post'
        });
      }
    });
  },
  showFiles: function (evt) {
    this.$showFilesButton.hide();
    this.$fileBrowser.show();
    this.codeView.$el.addClass('with-file-browser');
  },
  hideFiles: function (evt) {
    this.$showFilesButton.show();
    this.$fileBrowser.hide();
    this.codeView.$el.removeClass('with-file-browser');
  },
  showFileMenu: function (evt) {
    var fileRoot = _.findWhere(this.childViews, {name:'file_tree'});
    fileRoot.contextMenu(evt);
  },
  getTemplateData: function () {
    // only rendered once.. passes through context
    return _.extend(this.options.context, this.options);
  }
});

module.exports.id = "CodeEditor";
