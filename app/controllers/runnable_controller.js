var _ = require('underscore');
var async = require('async');
var fetch = require('./fetch');
var utils = require('../utils');
var channelController = require('./channel_controller');
var Container = require('../models/container');

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

function fetchContainer (containerId, callback) {
  var spec = {
    container: {
      model: 'Container',
      params: {
        _id: containerId
      }
    }
  }
  fetch.call(this, spec, function (err, results) {
    callback(err, results && results.container);
  });
}

function createContainerFromImage (imageId, callback) {
  var self = this;
  var app = this.app;
  if (false) {
    // HARDCODED FOR NOW PULLS THE SAME CONTAINER OVER AND OVER
    fetchContainer.call(this, "UdcnToI_TdJ1AAAG", callback);
  }
  else {
    var container = new Container({}, { app:app });
    var options = utils.successErrorToCB(callback);
    container.url = _.result(container, 'url') + '?from=' + imageId;
    container.save({}, options);
  }
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
    cb(err, results && results.related)
  });
}

module.exports = {
  index: function(params, callback) {
    var self = this;
    if (params._id.length != 16) {//TODO Re-implemented(!utils.isObjectId64(params._id)) {
      // redirect to channel page
      var channelParams = { channel:params._id };
      channelController.index.call(this, channelParams, callback);
    }
    else {
      var self = this;
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
          createContainerFromImage.call(self, results.image.id, function (err, container) {
            cb(err, container && _.extend(results, {
              container: container
            }));
          });
        },
        function files (results, cb) {
          var container = results.container;
          var options = utils.successErrorToCB(function (err) {

            cb(err, results); // rootDir is a child of container.. so already is passed along
          });
          container.rootDir.contents.debugParse = true;
          container.rootDir.contents.fetch(options);
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
            console.log(results.container.rootDir.contents.toJSON());
            cb(null, results);

          // }
        }
      ], callback);
    }
  },
  new: function(params, callback) {
    var controller = this;
    console.log(params);
    if (params.channel.length === 16 ) {
      redirectToProject(params.channel);
    } else {
      redirectToChannel(params.channel);
    }
    function redirectToProject (projectId) {
      var spec = {
        project: {
          model : 'Project',
          params: {
            _id: projectId
          }
        }
      };
      fetch.call(controller, spec, function (err, results) {
        if (err) {
          callback(err);
        } else {
          console.log(results);
          var project = results.image;
          controller.redirectTo('/' +
            project.get('_id') + '/' +
            utils.urlFriendly(project.get('name')) + '/edit');
        }
      });
    }

    function redirectToChannel (channel) {
      var spec = {
        channel: {
          model : 'Channel',
          params: {
            tag: channel
          }
        }
      };
      fetch.call(controller, spec, function (err, results) {
        if (err) {
          callback(err);
        } else {
          var defaultProject = results.channel.get('0').defaultProject;
          redirectToProject(defaultProject);
        }
      });
    }
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
        fetchContainer.call(self, results.image, function (err, container) {
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
    // var spec = {
    //   collection: {collection: 'Collection', params: params}
    // };
    // this.app.fetch(spec, function(err, result) {
    //   callback(err, '<% _.underscored(this.name) %>_index_view', result);
    // });
    callback();
  }
};
