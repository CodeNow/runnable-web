var _ = require('underscore');
var async = require('async');
var fetch = require('./fetch');
var utils = require('../utils');
var channelController = require('./channel_controller');
var Container = require('../models/container');

function fetchUserAndProject (imageId, callback) {
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
  var self = this;
  // HARDCODED ALTERNATIVE FOR NOW PULLS THE SAME CONTAINER OVER AND OVER
  containerId = "Ucy_ptNl9xtOzyYt"

  async.waterfall([
    function container (cb) {
      var spec = {
        container: {
          model: 'Container',
          params: {
            _id: containerId
          }
        }
      }
      fetch.call(self, spec, function (err, results) {
        cb(err, results && results.container);
      });
    },
    function rootDir (container, cb) {
      function fetchCallback (err, model) {
        cb(err, container); // callsback container.. not dir.
      }
      var options = _.extend(utils.successErrorToCB(fetchCallback));
      container.rootDir.fetch(options);
    }
  ], callback);
}

function fetchContainerByImage (image, callback) {
  var self = this;
  var app = this.app;
  //do something with the image
  var containerId = 'bogus';
  fetchContainer.call(this, containerId, callback);
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
        fetchUserAndProject.bind(this, params._id),
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
          fetchContainer.call(self, results.image, function (err, container) {
            cb(err, container && _.extend(results, {
              container: container
            }))
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
            console.log(results.user.id);
            cb(null, _.extend(results,{
              action : params.action
            }));

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
          // hackish likely a change to api-server to clean up
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
  }

};
