var Base = require('./base');
var FileCollection = require('../collections/files');
var DirModel = require('./dir');
var Super = Base.prototype;
var utils = require('../app').prototype.utils; //hacky..
var _ = require('underscore');
var moment = require('moment');

module.exports = Base.extend({
  urlRoot: 'runnables',
  initialize: function (model, options) {
    Super.initialize.apply(this, arguments);
    var self = this;
    // Initialize openFiles and rootDir
    this.openFiles = new FileCollection(null, {project:this});
    this.rootDir = new DirModel({path:'/'}, { project:this, silent:true });
    // Events
    console.log("GET HERE XXX1");
    this.rootDir.set({"name":"", "open": "true", "path": "/", "contents":[{"content": "RG9jcyBhdCBbbm9kZW", "name": "README.md", "path": "/README.md", "type":"file"},{"content": "RG9jcyBhdCBbbm9kZWpzLm9yZ10oaHR0cDovL25vZGVqcy5vcmcpRG9jcyBhdCBbbm9kZWpzLm9yZ10oaHR0cDovL25vZGVqcy5vcmcp", "name": "package.json", "path": "/package.json", "type":"file"},{"content": "RG9jcyBhdCBbbm9kZWpzLm9yZ10oaHR0cDovL25vZGVqcy5vcmcp", "name": "server.js", "path": "/server.js","type":"file"}]});
    self.openFiles.add(self.rootDir.getPath('/server.js'));
    self.openFiles.add(self.rootDir.getPath('/package.json'));
    self.openFiles.setSelectedFile(self.rootDir.getPath('/package.json'));
    this.rootDir.on('change:contents', function () {
      console.log("GET HERE XXX2");
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
      this.onChangeRootDir();
    }
    else {
      this.listenToOnce(this, 'change:rootDirectory', this.onChangeRootDir.bind(this));
    }
  },
  defaults: {
    votes: 0
  },
  virtuals: {
    'niceFramework' : 'niceFramework',
    'niceCreated'   : 'niceCreated'
  },
  toJSON: function () {
    var data = Super.toJSON.call(this);
    _.each(this.virtuals, function (key, i) {
      var val = this.virtuals[key];
      data[key] = this[val]();
    }.bind(this));
    return data;
  },
  onChangeRootDir: function () {
    this.rootDir.set(this.get('rootDirectory'));
    // this.unset('rootDirectory');
  },
  isOwner: function (userId) {
    userId = userId || this.app.user; // default to current user if no id specified
    if (!userId) return;
    if (userId.id) userId = userId.id;
    return (this.get('owner') == userId);
  },
  isUserOwner: function (userId) {
    this.isOwner(this, arguments);
  },
  niceFramework: function () {
    var friendlyFrameworks = {
      'node.js'  : 'Node.js',
      'php'      : 'PHP',
      'python'   : 'Python'
    };
    return friendlyFrameworks[this.get('framework')];
  },
  niceCreated: function () {
    return moment(this.get('created')).fromNow();
  },
  incVote: function () {
    votes = this.get('votes') + 1;
    this.set('votes', votes);
    return this;
  },
  decVote: function () {
    votes = this.get('votes') - 1;
    this.set('votes', votes);
    return this;
  }
});

module.exports.id = 'Project';
