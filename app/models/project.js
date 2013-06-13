var Base = require('./base');
var FileCollection = require('../collections/files');
var DirModel = require('./dir');
var Super = Base.prototype;

module.exports = Base.extend({
  urlRoot: '/projects',
  initialize: function (model, options) {
    Super.initialize.apply(this, arguments);
    debugger;
    var self = this;
    // Initialize openFiles and rootDir
    this.openFiles = new FileCollection(null, {project:this});
    this.rootDir = new DirModel(null, {project:this});
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
  }
});

module.exports.id = 'Project';