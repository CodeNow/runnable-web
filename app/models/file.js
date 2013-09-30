var Base = require('./fs'); //!FS
var Super = Base.prototype;
var utils = require('../utils');
var _ = require('underscore');

module.exports = Base.extend({
  defaults: {
    type: 'file'
  },
  _unsaved: false,
  unFetched: function () {
    // this is wrong.. right now unsupported files have content undefined
    return !utils.exists(this.get('content'));
  },
  initialize: function (attrs, options) {
    Super.initialize.apply(this, arguments);
    this.listenTo(this, 'change:content', this.onChangeContent.bind(this));
    this.listenTo(this, 'sync', this.updateSaved.bind(this)); // on sync set unsaved to false
    this.updateSaved();
  },
  loseUnsavedChanges: function () {
    if (this.unsaved()) {
      this.set('content', this.savedContent);
      this.editorSession = null; //clear out editor session
    }
    return this;
  },
  _checkUnsaved: function () {
    return this.savedContent != this.get('content');
  },
  updateSaved: function () {
    this.savedContent = this.get('content');
    this.unsaved(false);
  },
  unsaved: function (bool) {
    if (utils.exists(bool)) {
      var prevUnsaved = this._unsaved;
      if (prevUnsaved != bool) {
        this._unsaved = bool; //set
        this.trigger('unsaved:content', bool);
      }
    }
    else {
      return this._unsaved; //get
    }
  },
  onChangeContent: function () {
    this.unsaved(this._checkUnsaved());
  },
  upload: function (parentDirId, file, path, cb) {
    var self = this;
    this.set('name', file.name);
    this.set('path', path);
    xhr = new XMLHttpRequest();
    // progress
    xhr.upload.addEventListener("progress", this.trigger.bind(this, 'progress'));
    // File uploaded
    xhr.onreadystatechange = function (oEvent) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 201) {
          utils.parseJSON(xhr.responseText, function (err, json) {
            if (err) { cb('Server error, please try again later.') } else {
              json = json[0]; //json is array
              self.set(json, {silent:true});
              self.updateSaved();
              cb(null, self);
            }
          })
        }
        else if (xhr.status === 403) {
          cb('File already exists');
        }
        else {
          cb('Error: '+xhr.statusText);
        }
      }
    };
    xhr.open("POST", utils.pathJoin('/api/-', this.urlRoot, parentDirId));
    var formData = new FormData();
    formData.append(file.name, file);
    xhr.send(formData);
  },
  selected: function () {
    return this.get('selected');
  }
});

module.exports.id = "File";