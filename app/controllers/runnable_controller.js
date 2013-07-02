var _ = require('underscore');
var fetch = require('./fetch');
var utils = require('../utils');
var channelController = require('./channel_controller');
var async = require('async');

function fetchContainer (projectId, cb) {
  var options = utils.successErrorToCB(cb)
  var container = new Container();
  container.save({
    parent:projectId // TODO: FROM
  }, options)
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
              model : 'Runnable',
              params: {
                _id: params._id
              }
            }
          };
          fetch.call(this, spec, callback);
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
        function getContainer (results, cb) {
          var image = results.image;
          fetchContainer(image._id, function (err, container) {
            cb(err, container && _.extend(results, {
              container: container
            }))
          });
        },
        function getRelated (results, cb) {
          // If project has tags, fetch related projects
          var tags = project.get('tags');
          var tag = tags && tags[0] && tags[0].name;
          if (tag) {
            fetchRelated.call(self, tag, function (err, related) {
              callback(err, _.extend(results, {
                related: related,
                action : params.action
              }));
            });
          }
          else {
            callback(null, _.extend(results, {
              action: params.action
            }));
          }
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
