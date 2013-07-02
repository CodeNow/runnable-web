var Runnable = require('./runnable');
var FileCollection = require('../collections/files');
var DirModel = require('./dir');
var _ = require('underscore');
var Super = Runnable.prototype;

module.exports = Runnable.extend({
  urlRoot: '/users/me/runnables',
  initialize: function (model, options) {
    Super.initialize.apply(this, arguments);
    var self = this;
    // Initialize openFiles and rootDir
    this.openFiles = new FileCollection(null, {project:this, app:this.app});
    this.rootDir = new DirModel({path:'/'}, { project:this, silent:true, app:this.app });

    this.rootDir.on('change:contents', function () {
      var serverFile = this.rootDir.getPath('/server.js');
      this.openFiles.add(serverFile);
      // this.rootDir.set({open:true}, {silent:true}); // opens rootDir by default, if it has contents
      // var defaultFilepaths = this.get('defaultFile');
      // if (defaultFilepaths) {
      //   defaultFilepaths.forEach(function (filepath) {
      //     if (filepath[0] !== '/') filepath = '/'+filepath; // prepend slash
      //     var defaultFile = self.rootDir.getPath(filepath);
      //     if (defaultFile) self.openFiles.add(defaultFile); // open default files immediately, if they exist
      //   });
      // }
    }, this);

    if (this.get('rootDirectory')) {
      this.onChangeRootDirectory();
    }
    this.listenTo(this, 'change:rootDirectory', this.onChangeRootDirectory.bind(this));
    this.listenTo(this.rootDir, 'change', this.onChangeRootDirModel.bind(this));
  },
  virtuals: function () {
    var virtuals = _.clone(_.result(Super, 'virtuals'));
    return _.extend(virtuals, {});
  },
  onChangeRootDirModel: function () {
    this.set('rootDirectory', this.rootDir.toJSON(), {silent:true});
  },
  onChangeRootDirectory: function () {
    this.rootDir.set(this.get('rootDirectory'));
    // this.unset('rootDirectory');
  }
});

module.exports.id = "Container";