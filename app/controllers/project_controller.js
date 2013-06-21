var _ = require('underscore');
var fetch = require('./fetch');
var utils = require('../utils');

module.exports = {
  index: function(params, callback) {
    console.log(this.currentRoute);
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
        console.log('ERROR!', err);
        callback(err, results);
      }
      else if (!results || !results.project) {
        // TODO:
        // figure out how to "next()";
        console.log('miss what')
      }
      else {
        var projectUrlName = utils.urlFriendly(results.project.get('name'));
        if (params.name != projectUrlName) {
          // Name in url does not match project -- Redirect to Correct URL
          var project = results.project;
          var urlWithName = [project.id, projectUrlName].join('/');
          console.log('REDIRECT', urlWithName)
          controller.redirectTo(urlWithName);
        }
        else {
          var tags = results.project.get('tags');
          if (tags && tags.length) {
            // If project has tags, fetch related projects
            var spec2 = {
              related: {
                collection:'Projects',
                params:{
                  'tags.name': tags[0].name,
                  limit: 5,
                  sort: '-votes'
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
      }
    });
  },
  "new": function(params, callback) {
    callback();
  }
};