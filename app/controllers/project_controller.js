module.exports = {
  index: function(params, callback) {
    var spec = {
      user: { model:'User', params:{} },
      project: { model:'Project', params:params }
    };
    this.app.fetch(spec, function (err, results) {
      // if (true) {
      //   callback('route');
      // }
      // else
      callback(err, results);
    });
  }
};