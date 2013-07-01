var _ = require('underscore');
var fetch = require('./fetch');
var utils = require('../utils');
var channelController = require('./channel_controller');

module.exports = {
  index: function(params, callback) {
    var self = this;
    if (params._id.length != 16) {//TODO Re-implemented(!utils.isObjectId64(params._id)) {
      // redirect to channel page
      var channelParams = { channel:params._id };
      channelController.index.call(this, channelParams, callback);
    }
    else {
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
        } else if (!results || !results.project) {
          err = {status:404};
          callback(err);
        } else {
          var projectUrlName = utils.urlFriendly(results.project.get('name'));
          if (params.name != projectUrlName) {
            var project = results.project;
            var urlWithName = [project.id, projectUrlName].join('/');
            controller.redirectTo(urlWithName);
          } else {
            // If project has tags, fetch related projects
            var tags = results.project.get('tags');
            console.log('TAGS:', tags)
            if (tags && tags.length) {
              var spec2 = {
                related: {
                  collection:'Projects',
                  params:{
                    'tags': tags[0].name,
                    limit: 5,
                    sort: 'votes'
                  }
                }
              };
              fetch.call(self, spec2, function (err, results2) {
                console.log('foo', _.extend(results, results2, {
                  action: params.action
                }))
                callback(err, _.extend(results, results2, {
                  action: params.action
                }));
              });
            }
            else {
              results.action = params.action;
              callback(err, results);
            }
          }
        }

      });
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
          var project = results.project;
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
      else if (!results || !results.project) {
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
