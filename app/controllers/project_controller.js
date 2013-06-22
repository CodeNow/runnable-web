var _ = require('underscore');
var fetch = require('./fetch');
var utils = require('../utils');
var channelController = require('./channel_controller');

module.exports = {
  index: function(params, callback) {
    if (!utils.isObjectId64(params._id)) {
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
        }
        else if (!results || !results.project) {
          err = {status:404};
          callback(err);
        }
        else if (params.name != utils.urlFriendly(results.project.get('name'))) {
          // Name in url does not match project -- Redirect to Correct URL
          var project = results.project;
          var urlWithName = [project.id, projectUrlName].join('/');
          controller.redirectTo(urlWithName);
        }
        else {
          // If project has tags, fetch related projects
          var tags = results.project.get('tags');
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
            fetch(spec2, function (err, results2) {
              callback(err, _.extend(results, results2));
            });
          }
          else {
            callback(err, results);
          }
        }
      });
    }
  },
  "new": function(params, callback) {
    callback();
  }
};