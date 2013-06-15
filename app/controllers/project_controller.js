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
        // Project fetch failed -- bc probably a Channel Route
        throw 'this doesnt work';
        // controller.app.req.next();
      }
      else if (params.name != results.project.get('name')) {
        // Name in url does not match project -- Redirect to Correct URL
        var project = results.project;
        var urlWithName = [project.id, project.get('name')].join('/');
        controller.redirectTo(urlWithName);
      }
      else {
        // project view
        // traverse file tree models and add them to results for prepop -> memory store
        var app = results.project.app;
        (function addDirAndChildrenToResults (dir) {
          results[dir.cid] = dir;
          console.log('added', dir.get('path'));
          dir.collection().forEach(function (fs) {
            if (fs.isDir()) {
              addDirAndChildrenToResults(fs);
            }
            else { // file
              fs.app = app;
              results[fs.cid] = fs;
              console.log('added', fs.get('path'));
            }
          });
        })(results.project.rootDir);

        callback(err, results);
      }
    });
  }
};