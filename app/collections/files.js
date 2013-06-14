var File = require('../models/file');
// var Base = require('./base');
var Base = require('backbone').Collection;
var Super = Base.prototype;
var App = require('../app').prototype; //hacky..

module.exports = Base.extend({
  model: File,
  initialize: function (attrs, options) {
    Super.initialize.apply(this, arguments);
    this.project = options && options.project;
    this.on('add', this.onAdd, this);
    // this.on('remove', this.onRemove, this);
    this.orderCount = 0;
    this.on('add remove', this.onAddRemove, this);
    this.on('change:content change:savedContent', this.onChangeContent, this);
    this.once('add', this.firstAdd);
    this.previouslyHadUnsavedChanges = false;
  },
  comparator: 'sort',
  dispose: function () {
    this.off('change:content change:savedContent', this.onChangeContent, this);
    this.off('add remove', this.onAddRemove, this);
  },
  firstAdd: function (fileModel) {
    this.selectedFileModel = fileModel; // this is the default file basically.
  },
  onAddRemove: function () {
    if (this.hasUnsavedChanges()) {
      this.trigger('hasUnsavedChanges');
    }
    else {
      this.trigger('noUnsavedChanges');
    }
  },
  onChangeContent: function (model) {
    var unsavedChanges = model.hasUnsavedChanges();
    if (model.previouslyHadUnsavedChanges !== unsavedChanges) {
      if (!unsavedChanges) {
        this.trigger('noUnsavedChanges');
      }
      else { // (unsavedChanges)
        this.trigger('hasUnsavedChanges');
      }
    }
  },
  onAdd: function (model) {
    model.on('destroy', this.onModelDestroyed, this);
    // model.set('sort', this.orderCount++);
    if (this.length === 1) { // if first model added set as selected
      this.selectedFile(model);
    }
  },
  onModelDestroyed: function (model) {
    this.remove(model);
  },
  setSelectedFile: function (fileModel, options) {
    options = options || {};
    if (typeof fileModel == 'string') {
      filePath = fileModel;
      fileModel = this.get(filePath);
      if (fileModel) {
        this.setSelectedFile(fileModel);
      }
      else {
        console.error(filePath+' not found.');
      }
    }
    else {
      if (this.selectedFileModel !== fileModel) {
        this.selectedFileModel = fileModel;
        if (!options.silent) {
          this.trigger('select:file', this.selectedFile());
        }
      }
    }
  },
  selectedFile: function (fileModel, options) {
    var filePath;
    if (App.utils.exists(fileModel)) {
      this.setSelectedFile(fileModel, options);
    }
    else {
      return this.selectedFileModel || this.at(0);
    }
  },
  remove: function (fileModel) {
    var currentIndex, nextIndex;
    if (this.selectedFile() === fileModel) {
      currentIndex = this.indexOf(this.selectedFile());
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        nextIndex = 0;
      }
    }
    // Always
    fileModel.loseUnsavedChanges();           // Reset unsavedChanges for file
    Super.remove.apply(this, arguments);     // remove The Model
    if (App.utils.exists(nextIndex)) {
      // AFTER it is removed, setSelectedFile bc it can accept undefined and still set the model.
      this.setSelectedFile(this.at(nextIndex));
    }
  },
  hasUnsavedChanges: function () {
    return this.some(function (file) {
      return file.hasUnsavedChanges();
    });
  },
  hasUnsavedNonClientSideChanges: function () {
    return this.some(function (file) {
      return file.hasUnsavedChanges() && !file.isClientSide();
    });
  },
  saveAll: function (projectId, callback) {
    var self = this;
    var anyHadUnsavedChanges = false;
    var anyNonClientSideFilesChanged = false;
    var fileModels = this.toArray();
    // move package.json ot the front
    fileModels.sort(function (a, b) {
      return (a.get("name") == "package.json") ? -1 : 0;
    });
    async.forEach(fileModels, function(fileModel, acb) {
      if (fileModel.hasUnsavedChanges()) {
        fileModel.saveFile(projectId, acb);
      }
      else {
        acb();
      }
    }, callback);
  }
});

module.exports.id = "Files";