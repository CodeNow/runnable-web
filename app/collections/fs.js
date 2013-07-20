var Base = require('./base');
var Super = Base.prototype;
var utils = require('../utils');
var async = require('async');
var File = require('../models/file');
var Dir = require('../models/dir');

module.exports = Base.extend({
  initialize: function (model, options) {
    var self = this;
    this.model = function (attrs, opts) {
      opts = opts || {};
      opts.app = self.app;
      attrs.containerId = self.containerId;
      return (attrs.dir) ?
        new Dir(attrs, opts) :
        new File(attrs, opts);
    };
    this._idAttr = File.prototype.idAttribute; // since model is a function must set idAttribute manually
    this.model.prototype = File.prototype;     // avoid rendr error, jsonKey in _parseModels shared/base/collection
    //initialize begins here, above is model method
    Super.initialize.apply(this, arguments);
    this.containerId = options.containerId;

    if (!this.length) {
      this.listenToOnce(this, 'sync change add', this.setFetched.bind(this));
    }
    else {
      this.setFetched();
    }
    var dispatch = this.app.dispatch;
    if (dispatch) {
      //clientside only
      this.listenTo(dispatch, 'get:fs', this.onGetFs.bind(this));
    }
  },
  url  : function () {
    return '/users/me/runnables/:containerId/files'
      .replace(':containerId', this.containerId);
  },
  setFetched: function () {
    this.fetched = true;
  },
  globalGet: function (modelId, cb, ctx) {
    ctx = ctx || this;
    var timeout = setTimeout(cb.bind(ctx, 'model not found'), 1000); // safety callback if not found anywhere...
    this.app.dispatch.trigger('get:fs', modelId, function () {
      clearTimeout(timeout);
      cb.apply(ctx, arguments);
    });
  },
  onGetFs: function (modelId, cb, ctx) {
    if (ctx) cb = cb.bind(ctx);
    var fs = this.get(modelId);
    if (fs) {
      cb(null, fs, this);
    }
  }
});

// module.exports = Base.extend({
//   // url: function () { return '/projects/' + this.project.id + '/files' + this.path; },
//   // url: function () { return '/api/projects/' + this.project.id + '/files' + this.path; },
//   url: function () { return ['/users/me/runnables/', this.project.id, '/files?path=', this.path].join(''); },
//   initialize: function (attrs, options) {
//     Super.initialize.apply(this, arguments);
//     this._idAttr = File.prototype.idAttribute; //backbone bug hack to make idAttr still work for the collection when its model is dynamically determined
//     this.project = options && options.project;
//     this.parentDir  = options && options.parentDir;

//     var self = this;
//     this.model = function (attrs, opts) {
//       var model;
//       opts = opts || {};
//       opts.project   = self.project;
//       opts.parentDir = self.parentDir;
//       if (!attrs.type || attrs.type === 'file') { // TODO: dont need to assume file over dir
//         model = new File(attrs, opts);
//       }
//       else if (attrs.type == 'dir') {
//         model = new Dir(attrs, opts);
//       }

//       return model;
//     };
//     this.on('add', this.attachModelEvents, this);
//   },
//   comparator: function (a, b) {
//     var sortName = function (a, b) {
//       var A = a.get('name');
//       var B = b.get('name');
//       if (A == B) return 0;
//       if (A.toLowerCase() < B.toLowerCase()) return -1;
//       if (A.toLowerCase() > B.toLowerCase()) return 1;
//     };
//     var sortType = function (a, b) {
//       if (a.get('type') == b.get('type')) return 0;
//       if (a.isDir()  && b.isFile()) return -1;
//       if (a.isFile() && b.isDir() ) return 1;
//     };

//     return (sortType(a, b) || sortName(a, b));
//   },
//   attachModelEvents: function (model) {
//     if (model)
//       model.on('destroy', this.onModelDestroyed, this);
//   },
//   onModelDestroyed: function (model) {
//     this.remove(model);
//   },
//   setProject: function (project) {
//     this.project = project;
//     return this;
//   },
//   setPath: function (path) {
//     this.path = path;
//     return this;
//   },
//   getFirstFile: function () {
//     return this.where({type:'file'})[0];
//   },
//   getFirstDir: function () {
//     return this.where({type:'dir'})[0];
//   },
//   getByName: function (name) {
//     if (!this.parentDir) throw new Error('cant get by name if not parent dir');
//     var currPath = this.parentDir.get('path');
//     var path = utils.pathJoin(currPath, name);
//     return this.get(path);
//   },
//   add: function () {
//     if (this.parentDir) {
//       if (this.parentDir.get('contents') === null) { //contents have not been fetch so just ignore the add..
//         return;
//       }
//     }
//     return Super.add.apply(this, arguments);
//   }

// });

module.exports.id = "Fs";