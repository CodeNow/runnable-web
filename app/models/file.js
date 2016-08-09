var Base = require('./fs'); //!FS
var Super = Base.prototype;
var utils = require('../utils');
var _ = require('underscore');
var JSDiff = require('diff');
var keypather = require('keypather')();

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
    this.unsaved(false);
  },
  parse: function (response, options) {
    // if the file is unsaved and the response has content
    // check to see what was sent.
    if (this.unsaved() && _.isString(response.content)) {
      if (_.isString(options.attrs.content)) {
        this.unsaved(false);
      }
      else {
        delete response.content;
      }
    }
    return Super.parse.apply(this, arguments);
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
  save: function (attrs, opts) {
    Super.save.apply(this, arguments);
    if (attrs && utils.exists(attrs.content)) {
      var diff = JSDiff.diffLines(this.savedContent, attrs.content)
        .map(function (d) {
          if (!d.added && !d.removed && d.value) {
            d.split = d.value.split('\n');
            d.value = undefined;
          }
          return d;
        });
      var data = { diff: diff };
      utils.addModelProperties(data, this);
      utils.addModelProperties(data, this.app.user, 'app.');
      Track.event('File', 'Save', data);
    }
  },
  unsaved: function (bool) {
    if (utils.exists(bool)) {
      var prevUnsaved = this._unsaved;
      if (prevUnsaved != bool) {
        this._unsaved = bool; //set
        if (this.app.user.get('isVerified')) {
          this.trigger('unsaved:content', bool);
        }
        else {
          this.app.dispatch.trigger('unsaved:unverifiedUser', bool);
          this.trigger('unsaved:unverifiedUser', bool);
        }
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
            if (err) { cb('Server error, please try again later.'); } else {
              json = json[0]; //json is array
              self.set(json, {silent:true});
              self.updateSaved();
              cb(null, self);
            }
          });
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
  },
  getFullPath: function () {
    return utils.pathJoin(this.get('path'), this.get('name'));
  }
});

module.exports.id = "File";