var _ = require('underscore');
var async = require('async');
var fetch = require('./fetch');
var utils = require('../utils');
var channelController = require('./channel_controller');
var Container = require('../models/container');

function fetchContainer (image, callback) {
  var self = this;
  var app = this.app;

  async.waterfall([
    // fetchContainer currently retrieve same container over and over
    // only works if user is NOT owner of parent.
    // function container (cb) {
    //   var spec = {
    //     container: {
    //       collection: 'Containers',
    //       params: {
    //         parent: image.id
    //       }
    //     }
    //   };
    //   fetch.call(self, spec, function (err, results) {
    //     if (err) { cb(err); } else {
    //       if (results && results.container && results.container.length) {
    //         cb(null, results.container.at(0));
    //       }
    //       else {
    //         // existing container not found
    //         var container = new Container({}, { app:app });
    //         var options = _.extend(utils.successErrorToCB(cb), {
    //           url: "/users/me/runnables?from="+image.id
    //         })
    //         container.save({}, options);
    //       }
    //     }
    //   });
    // },
    function container (cb) {
      // HARDCODED ALTERNATIVE FOR NOW PULLS THE SAME CONTAINER OVER AND OVER
      var spec = {
        container: {
          model: 'Container',
          params: {
            _id: "Ucy_ptNl9xtOzyYt"
          }
        }
      }
      fetch.call(self, spec, function (err, results) {
        cb(err, results && results.container);
      });
    },
    function rootDir (container, cb) {
      function fetchCallback (err, model) {
        console.log(container.rootDir.toJSON());
        cb(err, container); // callsback container.. not dir.
      }
      var options = _.extend(utils.successErrorToCB(fetchCallback), {
        url: "/users/me/runnables?from="+image.id
      });
      container.rootDir.fetch(options);
    }
  ], callback);

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
        function fetchUserAndProject (cb) {
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
                _id: params._id
              }
            }
          };
          fetch.call(self, spec, function (err, results) {
            cb(err, results && _.extend(results, {
              action : params.action
            }));
          });
        },
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
          // hackish likely a change to api-server to clean up
          var defaultProject = results.channel.get('0').defaultProject;
          redirectToProject(defaultProject);
        }
      });
    }
  },

 output: function (params, callback) {
    var controller = this;
    var spec = {
      user: {
        model:'User',
        params:{
          _id: 'me'
        }
      },
      project: {
        model : 'Project',
        params: {
          _id: params._id
        }
      }
    };

    fetch.call(this, spec, function (err, results) {
      if (err) {
        callback(err);
      }
      else if (!results || !results.image) {
        err = {status:404};
        callback(err);
      }
      else {
        // If project has tags, fetch related projects
        results.noHeader = 1;
        results.noFooter = 1;
        callback(err, results);
      }
    });
  }

};
