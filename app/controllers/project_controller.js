module.exports = {
  index: function(params, callback) {
    var controller = this;
    var spec = {
      user: { model:'User', params:{} },
      project: { model:'Project', params:params }
    };
    // require('subl').openError(new Error());
    // console.log(new Error().stack);
    this.app.fetch(spec, function (err, results) {
      // console.log(err, results);
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
        callback(err, results);
      }
    });
  }
};