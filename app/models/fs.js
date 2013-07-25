var _ = require('underscore');
var Base = require('./base');
var utils = require('../utils');
var Super = Base.prototype;

// gets url from collection
module.exports = Base.extend({
  virtuals: {
    'fullPath' : 'fullPath'
  },
  isFile: function () {
    return (this.get('type') === 'file' || !this.get('dir'));
  },
  isDir: function () {
    return (this.get('type') === 'dir' || this.get('dir'));
  },
  isRootDir: function () {
    return (this.get('path') == '/' && this.get('name') === '');
  },
  fullPath: function () {
    return utils.pathJoin(this.get('path'), this.get('name'));
  },
  moveFromTo: function (fromCollection, toCollection, cb, ctx) {
    if (ctx) cb = cb.bind(ctx);
    if (fromCollection == toCollection) {
      cb();
    }
    else {
      var newPath = toCollection.params.path;
      var options = utils.cbOpts(saveCallback, this);
      options.patch = true;
      this.save({ path:newPath }, options);
      function saveCallback (err, model) {
        if (err) { cb(err); } else {
          fromCollection.remove(model);
          toCollection.add(model);
          cb(null, model, toCollection);
        }
      }
    }
  }
});

// module.exports = Base.extend({
//   idAttribute: 'path',
//   // /users/me/runnables/:runnableid/files
//   // /users/me/runnables/UaA06sqkSJhHAAAW/readDir
//   // url: function () { return '/users/me/runnables/' + this.project.id + '/readDir?path=' + (this.get(this.idAttribute) || ''); }, //backbone url encodes the id val by default..
//   // url: function () { return '/users/me/runnables/' + this.project.id + '/files2' + this.id; },
//   urlRoot: function () { return ['/users/me/runnables', this.project.id, 'files'].join('/'); },
//   initialize: function (attrs, options) {
//     Super.initialize.apply(this, arguments);
//     this.project = options && options.project;
//     this.parentDir  = options && options.parentDir;
//     this.listenTo(this, 'change:name', this.onChangeName.bind(this));
//     this.listenTo(this, 'change:path', this.onPathChange.bind(this));
//     if (this.dir) {
//       this.set('type', 'dir');
//     }
//     else {
//       this.set('type', 'file');
//     }
//   },
//   virtuals: {
//     isRootDir  : 'isRootDir',
//     downloadURL: 'getDownloadUrl',
//     niceType   : 'niceType'
//   },
//   validate: function (attrs, options) {
//     if (attrs.name !== undefined) {
//       var name = attrs.name, err;
//       if (!this.parentDir)
//         err = 'cannot rename root folder';
//       if (!name)
//         err = 'filename cannot be empty'; //or null
//       var fsWithName = this.parentDir.contents.getByName(name);
//       if (fsWithName && fsWithName != this)
//         err = '"'+fsWithName.id+'" already exists';
//       if (name.length > 25)
//         err = 'name can only be 25 chars max';
//       return err;
//     }
//   },
//   getRootDir: function () {
//     // stacktrace();
//     return this.project.rootDir;
//   },
//   isRootDir: function () {
//     return Boolean(this === this.getRootDir());
//   },
//   getPath: function (fsPath) {
//     var notEmptyStr = function (i) { return i !== ''; };
//     var fsPathSplit = fsPath.split('/');
//     var fsModel     = this.getRootDir();
//     fsPathSplit     = fsPathSplit.filter(notEmptyStr); // first item will be emptystr bc path starts with /
//     while (fsPathSplit.length) {
//       fsName = fsPathSplit.shift();
//       fsModel = fsModel.contents.getByName(fsName);
//       if (!fsModel) {
//         //FAILING HERE
//         return null;
//       }
//     }

//     return fsModel;
//   },
//   getByName: function () {
//     throw "getByName is on dir.contents";
//   },
//   getDownloadUrl: function () {
//     var url = _.result(this, 'url');
//     return url.replace('/files', '/zip');
//   },
//   onPathChange: function () {
//     // this whole function sucks..
//     // but it does alot so be careful editing it.
//     var FileModel = require('./file');
//     var DirModel  = require('./dir');
//     var nameRegex = new RegExp(utils.escapeRegExp(this.get('name'))+'$');
//     var oldPath = this.previousAttributes().path;
//     var newPath = this.get('path');
//     if (oldPath) {
//       var oldName = this.previousAttributes().name;
//       var oldNameRegex = new RegExp(utils.escapeRegExp(oldName)+'$');
//       var oldParentPath, newParentPath, oldParentDir, newParentDir, newFSModel;
//       if (oldName) {
//         oldParentPath = oldPath.replace(oldNameRegex, ''); // change name triggers change path..
//       }
//       oldParentPath = oldParentPath.replace(nameRegex, '');
//       newParentPath = newPath.replace(nameRegex, '');
//       if (oldParentPath !== newParentPath) { //only move if the path actually changes
//         oldParentDir = this.getPath(oldParentPath);
//         newParentDir = this.getPath(newParentPath);
//         oldParentDir.contents.remove(this.rollbackAttr('path', {silent:true}));
//         var reAddToOpenFiles;
//         if (this.project && this.project.openFiles.get(this.id)) {
//           reAddToOpenFiles = true;
//           this.project.openFiles.remove(this);
//         }
//         newParentDir.contents.add(this.set('path', newPath, {silent:true})); // TODO: figure out improvement vs if
//         if (this.project && reAddToOpenFiles) {
//           this.project.openFiles.add(this);
//         }
//         this.parentDir = newParentDir;
//       }
//       else {
//         newParentDir = this.getPath(newParentPath);
//         newParentDir.contents._byId[newPath] = newParentDir.contents._byId[oldPath];
//         delete newParentDir.contents._byId[oldPath];
//       }
//     }
//     return this;
//   },
//   onChangeName: function () {
//     var name  = this.get('name');
//     var path  = this.get('path');
//     var pathSplit = path.split('/');
//     pathSplit.pop();
//     var relPath = pathSplit.join('/');
//     this.set('path', utils.pathJoin(relPath, name));
//     //Fix this
//   },
//   niceType: function () {
//     if (this.isDir())
//       return 'folder';
//     else
//       return 'file';
//   },
//   isDir: function () {
//     return Boolean(this.get('type')=='dir');
//   },
//   isFile: function () {
//     return Boolean(this.get('type')=='file');
//   },
//   setProject: function (project) {
//     this.project = project;
//     return this;
//   },
//   rollbackAttr: function (attr, options) {
//     options = options || {};
//     var prevVal = this.previousAttributes()[attr];
//     this.set(attr, prevVal, options);
//     return this;
//   },
//   rename: function (name, cb) {
//     var self = this;
//     var err;
//     cb = cb || function () {};
//     if (this.get('name') == name) {
//       cb();
//     }
//     else {
//       err = this.validate({name:name});
//       if (err) { cb(err); } else {
//         var oldURL = _.result(this, 'url');
//         this.save({name:name}, {
//           type: 'put',
//           url : oldURL,
//           validate: false,
//           success: function (model) {
//             if (model.attributes.type === 'file') {
//               Track.event('File system', 'Renamed file', {
//                 filename: model.attributes.name,
//                 projectId: self.project.id
//               });
//             } else if (model.attributes.type === 'dir') {
//               Track.event('File system', 'Renamed folder', {
//                 foldername: model.attributes.name,
//                 projectId: self.project.id
//               });
//             }
//             cb(null, model);
//           },
//           error: function (model, xhr) {
//             self.rollbackAttr('name');
//             err = new Error('Error renaming '+self.niceType()+'.');
//             cb(err);
//           }
//         });
//       }
//     }
//   },
//   move: function (newPath, cb) {
//     var self = this;
//     var oldURL = _.result(this, 'url');
//     var oldPath = this.get('path');
//     this.save({ path:newPath }, {
//       type: 'put',
//       url : oldURL,
//       success: function (model) {
//         Track.event('File system', 'Renamed file', {
//           projectId: self.project.id,
//           filename: model.attributes.name,
//           foldername: newPath
//         });
//         cb();
//       },
//       error: function (model, xhr) {
//         var callbackGenericError = function (err) {
//           console.error(err);
//           err = new Error('Error moving '+self.get('type')+'.');
//           cb(err);
//         };
//         model.set('path', oldPath); // reset path and path onchange will handle the rest.
//         utils.parseJSON(xhr.responseText, function (err, jsonErr) {
//           if (err) { callbackGenericError(); } else {
//             if (jsonErr.code === 'EXISTS') {
//               err = new Error('Error: path already exists.');
//               cb(err);
//             }
//             else {
//               callbackGenericError();
//             }
//           }
//         });
//       }
//     });
//   },
//   getParentPath: function () {
//     return this.parentDir && this.parentDir.get('path');
//   },
//   del: function (cb) {
//     var self = this;
//     this.destroy({
//       success: function (model) {
//         if (model.attributes.type === 'file') {
//           Track.event('File system', 'Deleted file', {
//             filename: model.attributes.name,
//             projectId: self.project.id
//           });
//         } else if (model.attributes.type === 'dir') {
//           Track.event('File system', 'Deleted folder', {
//             foldername: model.attributes.name,
//             projectId: self.project.id
//           });
//         }
//         cb(null, model);
//       },
//       error: function (model, xhr) {
//         utils.parseJSON(function (err, jsonErr) {
//           if (err) {}
//         });
//         if (self.parentDir) self.parentDir.contents.add(self);
//         err = new Error('Error deleting '+self.get('type')+'.');
//         cb(err);
//       }
//     });
//   }
// });

module.exports.id = "Fs";