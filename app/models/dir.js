var Fs = require('./fs');
var Super = Fs.prototype;
var App = require('../app').prototype; //hacky..

module.exports = Fs.extend({
  initialize: function (attrs, options) {
    console.log("Initializing DirModel");
    Super.initialize.apply(this, arguments);
    this.project = this.project || attrs && attrs.project || options && options.project; // hacky for rendr
    var FSCollection = require('../collections/fs');

    this.contentsCollection = new FSCollection([], {
      project   : this.project,
      parentDir : this
    });
    this.contentsCollection.on('change add remove', this.onChangeContentsCollection, this);
    this.on('change:contents', this.onChangeContents, this);
    this.on('change:path', this.onChangePath, this);
    if (attrs && attrs.contents)
      this.onChangeContents();
  },
  defaults: function () {
    return {
      type: 'dir'
    };
  },
  onChangeContents: function () {
    this.contentsCollection.reset(this.get('contents'));
  },
  onChangePath: function () {
    var prevAttributes = this.previousAttributes();
    if (prevAttributes.toJSON) prevAttributes = prevAttributes.toJSON();
    var thisOldPath = prevAttributes.path;
    var thisNewPath = this.get('path');
    this.contentsCollection.forEach(function (fsModel) {
      var newFSPath = fsModel.get('path').replace(thisOldPath, thisNewPath);
      fsModel.set('path', newFSPath);
    });
  },
  onChangeContentsCollection: function () {
    this.set('contents', this.contentsCollection.toJSON(), {silent:true}); // must be silent to prevent inf loop
  },
  contents: function (val, options) { // RENDR!! renamed to collection from contents..bc render is doing some crazy retrieval of model attributes to object properties..
    if (val) { //set
      this.contentsCollection.update(val, options);
      return this;
    }
    else { //get
      return this.contentsCollection;
    }
  },
  addModel: function (model, cb) {
    var self = this;
    var newPath = model.get('path');
    var err;
    if (this.contents().get(newPath)) {
      err = new Error('Path already exists');
      cb(err);
    }
    else {
      if (!this.isNew()) { // if the parentDir isNew it's contents will be fetched later, so leave contents empty
        this.contents().add(model);
      }
      model.save(null, {
        type: "POST",
        success: function (model) {
          cb();
        },
        error: function (model, xhr) {
          var callbackGenericError = function (err) {
            if (err) console.error(err);
            err = new Error('Error adding '+model.get('name')+'.');
            cb(err);
          };
          App.utils.parseJSON(xhr.responseText, function (err, rspErr) {
            if (err) { callbackGenericError(err); } else {
              err = rspErr;
              if (rspErr.code == 'EEXISTS') {
                err = new Error('File/dir already exists.');
                cb(err);
              }
              else {
                callbackGenericError();
              }
            }
          });
        }
      });
    }
  },
  fetch: function () {
    console.log("GET HERE XXX5. Dir's 'fetch' is getting called");
    return Super.fetch.apply(this, arguments);
  },
  isNew: function () {
    return !App.utils.exists(this.get('contents'));
  },
  addFile: function (filename, cb) {
    var newPath = App.utils.pathJoin(this.get('path'), filename);
    var err;
    var options = { parentDir:this, project:this.project };
    var model = new FileModel({
      name: filename,
      path: newPath,
      type: 'file',
      content: ''
    }, options);
    this.addModel(model, cb);
  },
  addDir: function (dirname, cb) {
    var newPath = App.utils.pathJoin(this.get('path'), dirname);
    var err;
    var options = { parentDir:this, project:this.project };
    var model = new DirModel({
      name: dirname,
      path: newPath,
      type: 'dir'
    }, options);
    this.addModel(model, cb);
  },
  moveIn: function (fsPath, cb) {
    var self = this;
    var fsPathSplit  = fsPath.split('/');
    var fsName       = fsPathSplit.pop();
    var fsParentPath = fsPathSplit.join('/') || '/';
    var thisPath     = this.get('path');
    var newPath      = App.utils.pathJoin(thisPath, fsName);
    var fsModel;

    console.log("newPath", newPath);
    console.log("fsParentPath", fsParentPath);

    if (thisPath.indexOf(fsPath) === 0 && !App.utils.exists(thisPath[fsPath.length])) {
      cb(); // fs is this.. cant drop in self
    }
    else if (thisPath.indexOf(fsPath) === 0 && thisPath[fsPath.length] == '/') {
      cb(); // fs is this.. cant drop in child
    }
    else if (thisPath == fsParentPath) {
      cb(); // fs is already in this dir
    }
    else if (this.getPath(newPath)) {
      cb(new Error('Error moving file: "'+newPath+'" already exists.'));
    }
    else {
      fsModel = this.getPath(fsPath);
      if (fsModel) {
        fsModel.move(newPath, cb);
      } else {
        cb();
      }
    }
  }
});

module.exports.id = "Dir";