var _ = require('underscore');
var User = require('../models/user');

module.exports = {

  index: function(params, callback) {
    var spec = {
      user    : {
        model  : 'User',
        params : {
          _id: 'me'
        }
      },
      projects: {
        collection : 'Projects',
        params     : {
        }
      }
    };
    fetch.call(this, spec, callback);
  },

  jobs: function (params, callback) {
    var spec = {
      user: { model:'User', params:{} }
    };
    fetch.call(this, spec, callback);
  },

  privacy: function (params, callback) {
    var spec = {
      user: { model:'User', params:{} }
    };
    fetch.call(this, spec, callback);
  },

  about: function (params, callback) {
    var spec = {
      user: { model:'User', params:{} }
    };
    fetch.call(this, spec, callback);
  },

  providers: function (params, callback) {
    var spec = {
      user: { model:'User', params:{} }
    };
    fetch.call(this, spec, callback);
  }
};

// spec, [options], callback
function fetch(spec, options, callback) {
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
  var cb = function (err, result) {
    if (err) {
      if (err.status === 401) {
        createUser(function (err) {
          if (err) { callback(err); } else {
            app.fetch.call(app, spec, options, callback);
          }
        });
      }
      else {
        callback(err);
      }
    }
  };
  app.fetch.call(app, spec, options, cb);
}