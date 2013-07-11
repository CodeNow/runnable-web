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
      images: {
        collection : 'Images',
        params     : {
          sort: 'votes'
        }
      }
    };
    var self = this;
    fetch.call(this, spec, function (err, results) {
      if (err || results.images.length === 0) {
        // if err or no images found, go ahead and callback
        callback(err, results);
      } else {
        var userIds = results.images.map(function (run) {
          return run.get('owner');
        });
        var spec2 = {
          owners: {
            collection: 'Users',
            params    : {
              ids: userIds
            }
          }
        };
        fetch.call(self, spec2, function (err, userResults) {
          if (err) { callback(err); } else {
            results = _.extend(results, userResults);
            results.images.forEach(function (run) {
              run.owner = userResults.owners.get(run.get('owner'));
              return run;
            });
            callback(null, results);
          }
        });
      }
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
      channels: {
        collection : 'Channels',
        params: {}
      }
    };
    fetch.call(this, spec, callback);
  }
};
