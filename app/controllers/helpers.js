var User = require('../models/user');
var Container = require('../models/container');
var Dir = require('../models/dir');
var _ = require('underscore');
var async = require('async');
var utils = require('../utils');

module.exports = {
  'fetch':                  fetch,
  'fetchWithMe':            fetchWithMe,
  'fetchUser':              fetchUser,
  'fetchUserAndSearch':     fetchUserAndSearch,
  'fetchImplementation':    fetchImplementation,
  'fetchImplementations':   fetchImplementations,
  'fetchSpecification':     fetchSpecification,
  'fetchSpecifications':    fetchSpecifications,
  'fetchImage':             fetchImage,
  'fetchContainer':         fetchContainer,
  'fetchUserAndChannel':    fetchUserAndChannel,
  'fetchChannelContents':   fetchChannelContents,
  'fetchOwnerOf':           fetchOwnerOf,
  'fetchOwnersFor':         fetchOwnersFor,
  'fetchRelated':           fetchRelated,
  'fetchUserAndImage':      fetchUserAndImage,
  'fetchUserAndContainer':  fetchUserAndContainer,
  'fetchFilesForContainer': fetchFilesForContainer,
  'createContainerFrom':    createContainerFrom,
  'canonical':              canonical,
  'formatTitle':            formatTitle
};


function formatTitle () {
  var args = Array.prototype.slice.call(arguments);
  args.push('Runnable');
  return args.join(' - ');
}
// CONTEXT must be controller
function canonical () {
  if (isServer) {
    return 'http://runnable.com' + ((this.app && this.app.req && this.app.req.url) || '');
  }
  else {
    return 'http://runnable.com/' + Backbone.history.fragment;
  }
}
// spec, [options], callback
function fetch (spec, options, callback) {
  var app = this.app;
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  function createUser(cb) {
    var user = new User({}, { app:app });
    user.save({}, {
      success: function (model) {
        cb(null, model);
      },
      error: function () {
        cb(new Error('error creating user'));
      }
    });
  }
  var cb = function (err, results) {
    if (err && err.status === 401) {
      // "user not created" error, create user and try again.
      createUser(function (err) {
        if (err) { callback(err); } else {
          app.fetch.call(app, spec, options, function (err, results) {
            if (!err && results.user) { app.user = results.user; } // find some place better for this
            callback(err, results);
          });
        }
      });
    }
    else {
      if (!err && results.user) { app.user = results.user; } // find some place better for this
      callback(err, results);
    }
  };
  app.fetch.call(app, spec, options, cb);
}

function fetchWithMe (spec, options, callback) {
  var app = this.app;
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  fetchUser.call(this, gotMe);
  function gotMe (err, results) {
    if (err) {
      callback(err);
    } else {
      for (var model in spec) {
        if (model !== 'user') {
          for (var param in spec[model].params) {
            if (spec[model].params[param] === 'me') {
              spec[model].params[param] = results.user.id;
            }
          }
        }
      }
      app.fetch.call(app, spec, options, callback);
    }
  }
}

function fetchUser (callback) {
  var spec = {
    user: {
      model:'User',
      params:{
        _id: 'me'
      }
    }
  };
  fetch.call(this, spec, callback);
}

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

function fetchImplementation (specificationId, callback) {
  var spec = {
    implementation: {
      model: 'Implementation',
      params: {
        implements: specificationId
      }
    }
  };
  fetch.call(this, spec, function (err, results) {
    callback(err, results && results.implementation);
  });
}

function fetchImplementations (callback) {
  var spec = {
    implementations: {
      collection: 'Implementations',
      params: {}
    }
  };
  fetch.call(this, spec, function (err, results) {
    callback(err, results && results.implementations);
  });
}

function fetchSpecification (specificationId, callback) {
  var spec = {
    specification: {
      model: 'Specification',
      params: {
        _id: specificationId
      }
    }
  };
  fetch.call(this, spec, function (err, results) {
    callback(err, results && results.specification);
  });
}

function fetchSpecifications (callback) {
  var spec = {
    specifications: {
      collection : 'Specifications',
      params     : {}
    }
  };
  fetch.call(this, spec, function (err, results) {
    callback(err, results && results.specifications);
  });
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

function fetchUserAndChannel (channelName, callback) {
  var spec = {
    user: {
      model:'User',
      params:{
        _id: 'me'
      }
    },
    channel: {
      model: 'Channel',
      params: {
        name: channelName
      }
    }
  };
  fetch.call(this, spec, callback);
}

function fetchChannelContents (params, callback) {
  var channel = params.channel;
  var page = params.page || 1;
  var sort = params.sort ? '-'+params.sort : '-created';
  var spec = {
    images: {
      collection : 'Images',
      params     : {
        sort: sort,
        channel: channel,
        page: page-1 // api page starts at 0
      }
    },
    channels: {
      collection : 'Channels',
      params     : {
        channel: channel
      }
    }
  };
  fetch.call(this, spec, callback);
}

function fetchOwnersFor (user, runnables, callback) {
  if (runnables.length === 0) return callback(null, {});
  var userIds = runnables.map(function (run) {
    return run.get('owner');
  });
  var spec = {
    owners: {
      collection: 'Users',
      params    : {
        ids: userIds
      }
    }
  };
  fetch.call(this, spec, function (err, userResults) {
    if (err) { callback(err); } else {
      runnables.forEach(function (run) {
        var ownerId = run.get('owner');
        var owners = userResults.owners;
        if (ownerId === user.id) {
          run.owner = user;
          owners.remove(owners.get(ownerId));
        }
        else {
          run.owner = owners.get(ownerId);
        }
      });
      callback(null, userResults);
    }
  });
}

function fetchOwnerOf (user, runnable, callback) {
  fetchOwnersFor.call(this, user, [runnable], callback);
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

function createContainerFrom (imageIdOrChannelName, callback) {
  var app = this.app;
  var container = new Container({}, { app:app });
  var options = utils.successErrorToCB(callback);
  options.url = _.result(container, 'url') + '?from=' + imageIdOrChannelName;
  container.save({}, options);
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

  var spec = {
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
    fetch.bind(this, spec)
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

      // Select first default file
      var firstDefault = results.defaultFiles.at(0);
      if (firstDefault) {
        firstDefault.set('selected', true);
        if (results['fsc:'+firstDefault.get('path')]) {
          // if file exists elsewhere it's data should not conflict with another instance of itself..
          if (results['fsc:'+firstDefault.get('path')].get(firstDefault.id)) {
            results['fsc:'+firstDefault.get('path')].get(firstDefault.id).set('selected', true);
          }
        }
      }
      callback(err, results);
    }
  });
}

function fetchRelated (imageId, tags, cb) {
  var tagNames = tags.map(function (tag) {
    return tag.name;
  });
  var spec = {
    related: {
      collection:'Images',
      params: {
        channel: tagNames[0],
        limit: 10,
        sort: 'votes'
      }
    }
  };
  fetch.call(this, spec, function (err, results) {
    if (err) { cb(err); } else {
      var selfInRelated = results.related.get(imageId);
      if (selfInRelated) { results.related.remove(selfInRelated); }
      cb(null, results);
    }
  });
}

function fetchUserAndSearch (searchText, callback) {
  var spec = {
    user: {
      model:'User',
      params:{
        _id: 'me'
      }
    },
    images: {
      collection : 'Images',
      params: {
        search: searchText
      }
    }
  };
  fetch.call(this, spec, callback);
}