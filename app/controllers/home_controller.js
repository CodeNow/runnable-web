module.exports = {
  index: function(params, callback) {
    var spec = {
      user: { model:'User' },
      projects: { collection:'Projects' }
    };
    this.app.fetch(spec, function (err, result) {
      callback(err, 'home_view', result);
    });
  }
};
