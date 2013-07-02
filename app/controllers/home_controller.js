var _ = require('underscore');
var fetch = require('./fetch');

module.exports = {
  index: function(params, callback) {
    var spec = {
      user    : {
        model  : 'User',
        params : {
          _id: 'me'
        }
      },
      runnables: {
        collection : 'Images',
        params     : {
          sort: 'votes'
        }
      }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, results);
    });
  },

  jobs: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
  },

  privacy: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
  },

  about: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
  },

  providers: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
  },

  logout: function () {
    // force serverside hit for clientside (pushstate)
    if (typeof window !== "undefined" && window !== null) {
      window.location = '/logout';
    }
    this.app.req.session.destroy();
    this.redirectTo('/');
  },

  blob: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
  },

  new: function (params, callback) {
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
          sort: 'votes'
        }
      },
      channels: {
        collection : 'Channels',
        params: {}
      }
    };
    fetch.call(this, spec, callback);
  }
};
