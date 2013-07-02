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
    this.openFiles = new FileCollection(null, {project:this});
    this.rootDir = new DirModel({path:'/'}, { project:this, silent:true });

    this.rootDir.on('change:contents', function () {
      this.rootDir.set({open:true}, {silent:true}); // opens rootDir by default, if it has contents
      var defaultFilepaths = this.get('defaultFile');
      if (defaultFilepaths) {
        defaultFilepaths.forEach(function (filepath) {
          if (filepath[0] !== '/') filepath = '/'+filepath; // prepend slash
          var defaultFile = self.rootDir.getPath(filepath);
          if (defaultFile) self.openFiles.add(defaultFile); // open default files immediately, if they exist
        });
      }
    }, this);

    if (this.get('rootDirectory')) {
      this.onChangeRootDir();
    }
    else {
      this.listenToOnce(this, 'change:rootDirectory', this.onChangeRootDir.bind(this));
    }
  },
  virtuals: function () {
    var virtuals = _.clone(Super.virtuals);
    return _.extend(virtuals, {});
  },
});

module.exports.id = "Container";