var _ = require('underscore');

module.exports = {
  index: function(params, callback) {
    var controller = this;
    var spec = {
      user: { model:'User', params:{} },
      project: { model:'Project', params:params }
    };

    this.app.fetch(spec, function (err, results) {
      if (err) {
        callback(err);
      }
      else if (!results || !results.project) {
        // TODO:
        // figure out how to "next()";
      }
      else if (params.name != results.project.get('name')) {
        // Name in url does not match project -- Redirect to Correct URL
        var project = results.project;
        var urlWithName = [project.id, project.get('name')].join('/');
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
                tags:tags[0],
                limit: 5,
                sort: '-voteCount'
              }
            }
          };
          controller.app.fetch(spec2, function (err, results2) {
            callback(err, _.extend(results, results2));
          });
        }
        else {
          callback(err, results);
        }
      }
    });
  },
  "new": function(params, callback) {
    callback();
  }
};