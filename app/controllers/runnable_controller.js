var _ = require('underscore');
var async = require('async');
var fetch = require('./fetch');
var utils = require('../utils');
var channelController = require('./channel_controller');
var Container = require('../models/container');
var Dir = require('../models/dir');

function fetchUserAndImage (imageId, callback) {
  var spec = {
    user: {
      model:'User',
      params:{
        _id: 'me'
      }
    },
    image: {
      model : 'Image',
      params: {
        _id: imageId
      }
    }
  };
  fetch.call(this, spec, callback);
}

function fetchUserAndContainer (containerId, callback) {
  var spec = {
    user: {
      model:'User',
      params:{
        _id: 'me'
      }
    },
    container: {
      model : 'Container',
      params: {
        _id: containerId
      }
    }
  };
  fetch.call(this, spec, callback);
}

function fetchContainer (containerId, callback) {
  var spec = {
    container: {
      model: 'Container',
      params: {
        _id: containerId
      }
    }
  };
  fetch.call(this, spec, function (err, results) {
    callback(err, results && results.container);
  });
}

function fetchImage (imageId, callback) {
  var spec = {
    image: {
      model: 'Image',
      params: {
        _id: imageId
      }
    }
  };
  fetch.call(this, spec, function (err, results) {
    callback(err, results && results.image);
  });
}

function createContainerFrom (imageIdOrTemplateName, callback) {
  var self = this;
  var app = this.app;
  if (false) {
    // HARDCODED FOR NOW PULLS THE SAME CONTAINER OVER AND OVER
    // fetchContainer.call(this, "UduGQNJ_RwZkAAAR", callback);
    fetchContainer.call(this, "UdyCVDjBjrkbAAAG", callback);
  }
  else {
    var container = new Container({}, { app:app });
    var options = utils.successErrorToCB(callback);
    container.url = _.result(container, 'url') + '?from=' + imageIdOrTemplateName;
    container.save({}, options);

  }
}

function fetchFilesForContainer (containerId, callback) {
  var app = this.app;
  // rootDir needs an id else rendr wont store it in model_store,
  // also id cannot conflict with any other dir in rendr model_store
  var rootDir = new Dir({
    _id : 'root'+containerId,
    path: '/',
    name: '',
    dir : true,
    open: true,
    containerId: containerId
  }, {
    app: app
  });

  var defaultFilesSpec = {
    defaultFiles: {
      collection: 'OpenFiles',
      params: {
        containerId: containerId,
        'default'  : true
      }
    }
  };
  async.parallel([
    function (cb) {
      var opts = utils.successErrorToCB(cb);
      opts.data = rootDir.contents.params; // VERY IMPORTANT! - ask TJ.
      rootDir.contents.fetch(opts);
    },
    fetch.bind(this, defaultFilesSpec)
  ],
  function (err, data) {
    if (err) { callback(err); } else {
      // so now you have the root dir it's contents
      // and defaultFiles
      // TODO: build default files off root dir here
      var results = data[1]; // defaultFiles
      results.rootDir = rootDir;
      (function traverseTreeAndAddToResults (dir) {
        // doesnt matter what the key is just must be unique
        results['dir:'+dir.id] = dir;
        var contents = dir.contents;
        var path;
        if (contents) {
          path = contents.options.params.path;
          results['fsc:'+path] = contents;
          contents.forEach(function (fs) {
            if (fs.isDir()) {
              traverseTreeAndAddToResults(fs);
            }
          });
        }
      })(rootDir);
      callback(err, results);
    }
  });
}

function fetchRelated (tag, cb) {
  var spec = {
    related: {
      collection:'Projects',
      params: {
        'tags': tag,
        limit: 5,
        sort: 'votes'
      }
    }
  };
  fetch.call(this, spec, function (err, results) {
    cb(err, results && results.related);
  });
}

module.exports = {
  index: function(params, callback) {
    var self = this;
    if (params._id.length != 16) {//TODO Re-implemented(!utils.isObjectId64(params._id)) {
      // redirect to channel page
      var channelParams = { channel:params._id };
      this.currentRoute.action= 'index';
      this.currentRoute.controller= 'channel';
      channelController.index.call(this, channelParams, callback);
    }
    else {
      var req = self.app.req;

      async.waterfall([
        fetchUserAndImage.bind(this, params._id),
        function check404 (results, cb) {
          if (!results || !results.image) {
            cb({ status:404 });
          }
          else {
            cb(null, results);
          }
        },
        function nameInUrl (results, cb) {
          var image = results.image;
          var urlFriendlyName = utils.urlFriendly(results.image.get('name'));
          if (params.name != urlFriendlyName) {
            var urlWithName = [image.id, urlFriendlyName].join('/');
            self.redirectTo(urlWithName);
          }
          else {
            cb(null, results);
          }
        },
        function container (results, cb) {
          createContainerFrom.call(self, results.image.id, function (err, container) {
            cb(err, _.extend(results, {
              container: container
            }));
          });
        },
        function files (results, cb) {
          fetchFilesForContainer.call(self, results.container.id, function (err, fileResults) {
            cb(err, _.extend(results, fileResults));
          });
        },
        function related (results, cb) {
          // If project has tags, fetch related projects
          // var tags = project.get('tags');
          // var tag = tags && tags[0] && tags[0].name;
          // if (tag) {
          //   fetchRelated.call(self, tag, function (err, related) {
          //     cb(err, related && _.extend(results, {
          //       related: related
          //     }));
          //   });
          // }
          // else {
            // if(results.defaultFiles.at(0)) results.defaultFiles.at(0).set('selected', true);
            // var testopts = utils.successErrorToCB(function () {
            // })
            // results.defaultFiles.at(1).fetch(testopts)
            //DEFAULT FILES IS RETURNING DIRS AND ALL FILES?
            var defaultFiles = results.defaultFiles.filter(function (fs) {
              return fs.get('default') && fs.isFile();
            });
            results.defaultFiles.reset(defaultFiles);
            var firstDefault = results.defaultFiles.at(0);
            if (firstDefault) firstDefault.set('selected', true);
            cb(null, results);

          // }
        }
      ], function (err, results) {
        callback(err, results);
      });
    }
  },
  'new': function (params, callback) {
    var spec = {
      user    : {
        model  : 'User',
        params : {
          _id: 'me'
        }
      },
      channels: {
        collection : 'Channels',
        params: {}
      }
    };
    fetch.call(this, spec, callback);
  },
  newFrom: function(params, callback) {
    var self = this;
    createContainerFrom.call(this, params.from, function (err, container) {
      if (err) { callback(err); } else {
        self.redirectTo('/me/'+container.id);
      }
    });
  },
  output: function (params, callback) {
    var self = this;

    async.waterfall([
      // these will not need to be run sequentially when fetch container always fetches a new container
      function user (cb) {
        var spec = {
          user: {
            model:'User',
            params:{
              _id: 'me'
            }
          }
        };
        fetch.call(self, spec, cb);
      },
      function container (results, cb) {
        fetchContainer.call(self, params._id, function (err, container) {
          cb(err, container && _.extend(results, {
            container: container,
            noHeader : 1,
            noFooter : 1
          }))
        });
      }
    ], callback);
  },
  container: function (params, callback) {
    var self = this;
    async.waterfall([
      fetchUserAndContainer.bind(this, params._id),
      function parentImage (results, cb) {
        var imageId = results.container.get('parent');
        fetchImage.call(self, imageId, function (err, image) {
          cb(err, _.extend(results, {
            image: image
          }));
        });
      },
      function check404 (results, cb) {
        if (!results || !results.container) {
          cb({ status:404 });
        }
        else {
          cb(null, results);
        }
      },
      function files (results, cb) {
        fetchFilesForContainer.call(self, results.container.id, function (err, fileResults) {
          cb(err, _.extend(results, fileResults));
        });
      }
    ], function (err, results) {
      if (err) { callback(err); } else {

        //DEFAULT FILES IS RETURNING DIRS AND ALL FILES?
        var defaultFiles = results.defaultFiles.filter(function (fs) {
          return fs.get('default') && fs.isFile();
        });
        results.defaultFiles.reset(defaultFiles);
        var firstDefault = results.defaultFiles.at(0);
        // if (firstDefault) firstDefault.set('selected', true);
        callback(err, results);
      }
    });
  }
};
