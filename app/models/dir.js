var Base = require('./fs'); //!FS
var Super = Base.prototype;
var utils = require('../utils');
var utils = require('../utils');
var File = require('./file');
var _ = require('underscore');

module.exports = Base.extend({
  initialize: function (attrs) {
    Super.initialize.apply(this, arguments);
    var FSCollection = require('../collections/fs');
    var path = this.fullPath();
    var containerId = attrs.containerId;
    this.contents = new FSCollection(null, {
      app : this.app,
      params : {                    // params are used with render hydrate
        path : path,
        containerId: containerId,
        content: true // include file contents by default
      },
      containerId: containerId,
      path       : path
    });
  },
  defaults: {
    type: 'dir'
  },
  globalGet: function () { // (modelId)
    var contents = this.contents;
    contents.globalGet.apply(contents, arguments);
  },
  uploadFile: function (fileItem, callback, ctx) {
    if (ctx) callback = callback.bind(ctx);
    // if (fileItem.webkitGetAsEntry) {
    // TODO add support for directories
    // }
    // else {
    var maxMB = 10;
    if (fileItem.size > maxMB*1000*1000) {
      callback('Sorry "'+fileItem.name+'" is too big ('+maxMB+'MB max).');
    }
    else {
      this._uploadFileMultipart(fileItem, callback);
    }
  },
  _uploadFileMultipart: function (file, callback) {
    var urlRoot = _.result(this.contents, 'url');
    var fileModel = new File({}, {
      urlRoot: urlRoot,
      app: this.app
    });
    var dirId = (this.isRootDir()) ? "" : this.id;
    fileModel.upload(dirId, file, this.fullPath(), function (err, model) {
      if (err) { callback(err); } else {
        model.store(); // store model since it was created clientside
        callback(err, model);
      }
    });
  },
  _uploadFileJSON: function (urlRoot, file, callback) {
    var reader = new FileReader();
    reader.onload = function (evt) {
      var fileModel = new File({}, {
        urlRoot:urlRoot,
        app:this.app
      });
      var options = utils.cbOpts(saveCb);
      fileModel.save({
        name: file.name,
        path: this.fullPath(),
        content: evt.target.result
      }, options);
      function saveCb (err, model) {
        if (err) { callback(err); } else {
          model.store(); // must be stored on complete since it is created on frontend
          callback(null, model)
        }
      }
    }.bind(this);
    reader.onerror = function (evt) {
      if (evt.target.error.code === 1) {
        callback('Directory uploads not supported yet, BUT it does support dragging multiple files at once. Send us feedback! :)');
      }
      else {
        callback('Unknown error occurred, please try again later.');
      }
    };
    reader.readAsText(file);
  }
});

module.exports.id = "Dir";