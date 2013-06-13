module.exports = {
  index: function(params, callback) {
    var spec = {
      user: { model:'User', params:{} },
      project: { model:'Project', params:params }
    };
    var controller = this;
    // require('subl').openError(new Error());
    // console.log(new Error().stack);
    // debugger;
    this.app.fetch(spec, function (err, results) {
      if (!results || !results.project) {
        // project fetch failed -- bc probably a channel route
        controller.app.req.next();
      }
      else if (params.name != results.project.get('name')) {
        // name in url does not match project -- correct it
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