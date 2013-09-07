var BaseView = require('./base_view');
var _ = require('underscore');
var FileMenu = require('./file_menu');
var NewFileModal = require('./new_file_modal');
var utils = require('../utils');
var async = require('async');

module.exports = BaseView.extend({
  tagName: 'li',
  className: 'folder',
  events: {
    'contextmenu'          : 'contextMenu',
    'drop'                 : 'uploadFiles',
    'dragover'             : 'over', //necessary else drop wont work
    'dragleave'            : 'leave'
  },
  dontTrackEvents: ['dragover', 'dragleave'],
  postHydrate: function () {
    this.listenTo(this.app.dispatch, 'sync:files', this.sync.bind(this));
    this.listenTo(this.model, 'change:open', this.changeOpen.bind(this));
  },
  getTemplateData: function () {
    return this.options;
  },
  preRender: function () {
    if (this.model && this.model.get('open')) {
      this.className = 'folder open';
    }
  },
  postRender: function () {
    this.$contentsUL = this.$('ul').first();
    this.fileList = _.findWhere(this.childViews, {name:'fs_list'});
    this.collection = this.fileList.collection;
    // droppable
    this.$el.droppable({
      greedy: true,
      drop: this.moveDrop.bind(this),
      hoverClass: 'drop-hover'
    });
  },
  contextMenu: function (evt) {
    this.$(document).click(); // closes other context menus
    evt.preventDefault(); // prevent browser context menu
    evt.stopPropagation();
    if (this.menu) {
      this.menu.remove();
      this.menu = null;
    }
    var collection = this.collection;
    var modelId = $(evt.target).data('id');
    var model = collection.get(modelId);
    var createOnly = !Boolean(modelId); // if grey area clicked don't show rename or delete..could be confusing to user
    model = model || this.model;
    var menu = this.menu = new FileMenu({
      createOnly: createOnly,
      showDefault: this.options.editmode,
      model: model,
      top  : evt.pageY,
      left : evt.pageX,
      app  : this.app
    });
    this.listenToOnce(menu, 'rename',    model.trigger.bind(model, 'rename'));
    this.listenToOnce(menu, 'delete',    this.del.bind(this, model));
    this.listenToOnce(menu, 'default',   this.def.bind(this, model));
    this.listenToOnce(menu, 'undefault', this.undefault.bind(this, model));
    this.listenToOnce(menu, 'upload',    this.upload.bind(this, model));
    this.listenToOnce(menu, 'create',    this.create.bind(this));
    // stop listening
    this.listenToOnce(menu, 'remove', this.stopListening.bind(this, menu));
  },
  del: function (model) {
    var options = utils.cbOpts(this.showIfError, this);
    model.destroy(options);
  },
  def: function (model) {
    var options = utils.cbOpts(this.showIfError, this);
    options.patch = true;
    model.save({'default':true}, options);
  },
  undefault: function (model) {
    var options = utils.cbOpts(this.showIfError, this);
    options.patch = true;
    model.save({'default':false}, options);
  },
  create: function (type) {
    var collection = this.collection;
    this.newFileModal = new NewFileModal({
      collection : collection,
      type: type,
      app:this.app
    });
  },
  upload: function () {
    this.showMessage('Upload files by dragging them into the file browser.');
  },
  uploadFiles: function (evt) {
    if (!evt.originalEvent.dataTransfer) { return; } // for move drag and drop
    evt.stopPropagation();
    evt.preventDefault();
    evt = evt.originalEvent;
    var files = evt.dataTransfer.files;
    if (!files) {
      // no browser support
      this.showError('Sorry your browser does not support drag and drop uploads - we suggest using Google Chrome Browser');
    }
    else {
      this.dragClassOff(evt);
      var contents = this.collection;
      var dir = this.model;
      var self = this;
      // firefox does not hoist functions in blocks
      function eachFile (fileItem, cb) {
        self.app.dispatch.trigger('show:upload');
        dir.uploadFile(fileItem, function (err, fileModel) {
          if (!err) { contents.add(fileModel); }
          cb(err);
        });
      }
      function allDone (err) {
        self.showIfError(err);
        self.app.dispatch.trigger('hide:upload');
      }
      async.forEach(files, eachFile, allDone);
    }
  },
  changeOpen: function (model, open) {
    this.fileList.toggle(open);
  },
  sync: function () {
    if (this.model.get('open')) {
      var contents = this.collection;
      // firefox does not hoist functions in blocks
      function cb (err) {
        this.hideLoader();
        this.showIfError(err);
      }
      var options = _.extend(utils.cbOpts(cb, this), {
        data: contents.params,   // VERY IMPORTANT! - ask TJ.
        silent: true,            // silent until all the models are for sure in store..
        merge: true             // so model 'selected' dont get reset
      });
      contents.fetch(options);
    }
  },
  moveDrop: function (evt, ui) {
    evt.preventDefault();
    evt.stopPropagation();
    this.$el.removeClass('drop-hover');
    var self = this;
    var $itemDropped = $(ui.draggable).find('[data-id]');
    var fsid = $itemDropped.data('id');
    if (fsid) {
      var collection = this.collection;
      collection.globalGet(fsid, function (err, model, fromCollection) {
        if (err) {
          this.showError(err);
        }
        else {
          model.moveFromTo(fromCollection, collection, function (err) {
            if (err) {
              this.showError(err);
            }
          }, this);
        }
      }, this)
    }
  },
  over: function (evt) {
    this.dragClass(evt);
  },
  leave: function (evt) {
    this.dragClassOff(evt)
  },
  dragClass: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    if (this.model.isRootDir()) {
      $('div.file-browser').addClass('drop-hover');
    }
    else {
      this.$el.addClass('drop-hover');
    }
  },
  dragClassOff: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    if (this.model.isRootDir()) {
      $('div.file-browser').removeClass('drop-hover');
    }
    else {
      this.$el.removeClass('drop-hover');
    }
  },
  noop: function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
});

module.exports.id = "FileTree";
