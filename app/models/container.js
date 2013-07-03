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

    // keep rootDir and rootDirJSON in sync
    this.listenTo(this, 'change:rootDirJSON', this.onChangeRootDirJSON.bind(this));
    this.listenTo(this.rootDir, 'change', this.onChangeRootDir.bind(this));
    // initial rootDir fetch
    this.listenToOnce(this.rootDir, 'change:contents', this.onInitRootDir.bind(this));

    // onInitRootDir event must be attached before this.
    if (this.get('rootDirJSON')) {
      this.onChangeRootDirJSON();
    }
  },
  // virtuals: function () {
  //   var virtuals = _.clone(_.result(Super, 'virtuals'));
  //   return _.extend(virtuals, {});
  // },
  onInitRootDir: function () {
    var self = this;
    self.rootDir.set('open', true);
    this.initOpenFiles();
  },
  initOpenFiles: function () {
    var firstFile;
    this.rootDir.contents.toArray().some(function (fs) {
      if (fs.isFile()) firstFile = fs;
      return Boolean(firstFile);
    });
    console.log(firstFile.id);
    if (firstFile) {
      this.openFiles.add(firstFile);
    }
  },
  onChangeRootDir: function () {
    this.set('rootDirJSON', this.rootDir.toJSON(), {silent:true});
  },
  onChangeRootDirJSON: function () {
    this.rootDir.set(this.get('rootDirJSON')); // no silent here bc of model events
  }
});

module.exports.id = "Container";