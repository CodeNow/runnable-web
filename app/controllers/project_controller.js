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
        results.unpublished = results.project.get('unpublished'); // for showing publish warning etc
        callback(err, results);
      }
    });
  },
  "new": function(params, callback) {
    callback();
  }
};