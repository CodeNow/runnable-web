var User = require('../models/user');

// spec, [options], callback
// CONTEXT must be controller
var fetch = module.exports = function (spec, options, callback) {
  var app = this.app;
  if (typeof options == 'function') {
    callback = options;
    options = {};
  }
  function createUser(cb) {
    var user = new User({}, { app:app });
    user.save({}, {
      success: function (model) {
        cb(null, model);
      },
      error: function () {
        cb(new Error('error creating user'));
      }
    });
  }
  var cb = function (err, results) {
    if (err && err.status === 401) {
      // "user not created" error, create user and try again.
      createUser(function (err) {
        if (err) { callback(err); } else {
          app.fetch.call(app, spec, options, function (err, results) {
            if (results.user) app.user = results.user;// find some place better for this
            callback(err, results);
          });
        }
      });
    }
    else {
      if (results.user) app.user = results.user;// find some place better for this
      callback(err, results);
    }
  };
  app.fetch.call(app, spec, options, cb);
};
