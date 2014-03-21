var File = require('../models/file');
var Base = require('./base');
var Super = Base.prototype;
var utils = require('../utils');
var async = require('async');

module.exports = Base.extend({
  model: File,
  url  : function () {
    return '/users/me/runnables/:containerId/files'
      .replace(':containerId', this.containerId);
  },
  initialize: function (models, options) {
    Super.initialize.apply(this, arguments);
    this.containerId = options.containerId;

    this.listenTo(this, 'add', this.onAdd.bind(this));
    // dispatch is clientside only beware!
    var dispatch = this.app.dispatch;
    if (dispatch) {
      var self = this;
      this.listenTo(dispatch, 'get:highlighted', function (cb) {
        cb(null, self);
      });
      this.listenTo(dispatch, 'highlight:file', this.highlightFile.bind(this));
    }
  },
  onChangeSelected: function (selectedFile, selected) {
    // unselect other files when new file selected
    if (!selected) {
      selectedFile.set('highlight', false);
    }
    else {
      this.highlightFile(selectedFile);
    }
  },
  highlightFile: function (file, resetEmpty) {
    if (file) {
      if (resetEmpty) {
        this.removeAll();
      }
      if (~this.indexOf(file)) {
        file.set('highlight', true);
        console.log('ALREADY HIGHLIGHT');
      }
      else {
        this.add(file);
      }
    }
  },
  beforeRemove: function (fileRemoved) {
    fileRemoved.set('highlight', false);
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
  onAdd: function (fileAdded) {
    fileAdded.set('highlight', true);
    console.log('add HIGHLIGHT');
  }
});

module.exports.id = "HighlightedFiles";