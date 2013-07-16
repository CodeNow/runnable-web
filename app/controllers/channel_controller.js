var _ = require('underscore');
var helpers = require('./helpers');

var fetch = helpers.fetch;

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
          sort: 'votes',
          channel: params.channel
        }
      },
      channels: {
        collection : 'Channels',
        params     : {}
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
            results = _.extend(results, userResults, params);
            results.images.forEach(function (run) {
              run.owner = userResults.owners.get(run.get('owner'));
              return run;
            });
            callback(null, results);
          }
        });
      }
    });
  }
};