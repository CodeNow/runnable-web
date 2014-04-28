var File = require('../models/file');
var View = require('../models/view');
var Base = require('./base');
var Super = Base.prototype;
var utils = require('../utils');
var async = require('async');
var _ = require('underscore');

module.exports = Base.extend({
  //model: File,
  url  : function () {
    return '/users/me/runnables/:containerId/files'
      .replace(':containerId', this.containerId);
  },
  initialize: function (models, options) {

    var self = this;
    this.model = function (attrs, opts) {
      opts = opts || {};
      opts.app = self.app;
      opts.containerId = this.containerId;
      var model = (_.isString(attrs.content)) ?
        new File(attrs, opts):
        new View(attrs, opts);
      return model;
    };

    Super.initialize.apply(this, arguments);
    this.containerId = options.containerId;

    this.listenTo(this, 'change:selected', this.onChangeSelected.bind(this));
    this.listenTo(this, 'unsaved:content', this.onUnsavedContent.bind(this));
    this.listenTo(this, 'add', this.onAdd.bind(this));
    this.listenTo(this, 'close:file', this.remove.bind(this));
    // dispatch is clientside only beware!
    var dispatch = this.app.dispatch;
    if (dispatch) {
      this.listenTo(dispatch, 'open:file', this.openFile.bind(this));
      this.listenTo(dispatch, 'save:files', this.saveAll.bind(this));
      this.listenTo(dispatch, 'sync:files', this.syncAllFiles.bind(this));
      this.listenTo(dispatch, 'toggle:readme', this.selectNullFile.bind(this));
    }
  },
  selectNullFile: function (open) {
    if (open) this.selectFileAt(-1);
  },
  _unsaved: false,
  _checkUnsaved: function () {
    return this.some(function (file) {
      return file.unsaved();
    });
  },
  unsaved: function (bool) {
    if (utils.exists(bool)) {
      var prevUnsaved = this._unsaved;
      if (prevUnsaved != bool) {
        this._unsaved = bool; //set
        this.trigger('unsaved', bool);
        this.app.dispatch.trigger('unsaved:files', bool);
      }
    }
    else {
      return this._unsaved; //get
    }
  },
  onUnsavedContent: function () {
    this.unsaved(this._checkUnsaved());
  },
  openFile: function (file) {
    if (file) {
      if (~this.indexOf(file)) {
        file.set('selected', true);
      }
      else {
        this.add(file);
      }
    }
  },
  closeFile: function (file) {
    this.remove(file);
  },
  onChangeSelected: function (selectedFile, selected) {
    // unselect other files when new file selected
    if (selected) {
      this.app.dispatch.trigger('highlight:file', selectedFile, true);
      this
        .where({ selected:true })
        .filter(function (file) {
          return file != selectedFile;
        })
        .forEach(function (file) {
          file.set('selected', null);
        });
      var dispatch = this.app.dispatch;
      if (dispatch && selectedFile) {
        dispatch.trigger('toggle:readme', false);
      }
    }
  },
  selectedFile: function () {
    return this.findWhere({ selected:true });
  },
  beforeRemove: function (fileRemoved) {
    if (fileRemoved instanceof View)
      return;
    fileRemoved.loseUnsavedChanges();
    // update selected file
    if (fileRemoved.get('selected')) {
      var removedIndex = this.indexOf(fileRemoved);
      fileRemoved.set('selected', null);
      setTimeout(function () {             // timeout to ensure remove has completed
        this.selectFileAt(removedIndex-1);
      }.bind(this), 0);
    }
  },
  remove: function (models) {
    if (!Array.isArray(models)) {
      models = [models];
    }
    models.forEach(function (file) {
      this.beforeRemove(file);
      Super.remove.apply(this, arguments);
    }, this);
  },
  selectFileAt: function (index) {
    if (!utils.exists(index)) throw new Error('index required');
    if (index < 0) index = 0;
    if (index > this.length) index = this.length;
    var nextFile = this.at(index);
    if (nextFile) {
      nextFile.set('selected', true);
    }
    else {
      // TODO: this is kind of weird, but it is used when the last tab is closed,
      // or the readme html is shown
      this.trigger('change:selected', null, true); // gets triggered even if null
    }
  },
  onAdd: function (fileAdded) {
    fileAdded.set('selected', true);
  },
  saveAll: function (cb, ctx) {
    if (ctx) cb = cb.bind(ctx);
    if (this.unsaved()) {
      var unsavedFiles = this.toArray().filter(function (file) {
        return file.unsaved() && (file.get('type') === 'file');
      });
      async.forEach(unsavedFiles, function (file, acb) {
        var options = utils.cbOpts(acb);
        options.patch = true;
        file.save({content:file.get('content')}, options);
      }, cb);
    }
    else {
      cb();
    }
  },
  syncAllFiles: function () {
    this.forEach(function (file) {
      file.fetch();
      // file.editorSession = undefined
    });
  },
  unselectAllFiles: function () {
    var sf = this.selectedFile();
    if(sf){
      sf.set('selected', false);
    }
  }
});

module.exports.id = "OpenFiles";