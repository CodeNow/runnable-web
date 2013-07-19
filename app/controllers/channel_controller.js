var _ = require('underscore');
var helpers = require('./helpers');

var fetch = helpers.fetch;
var fetchOwnersFor = helpers.fetchOwnersFor;

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
        fetchOwnersFor.call(self, results.images, function (err, ownerResults) {
          callback(err, _.extend(results, ownerResults, { channel:params.channel }));
        });
      }
    });
  }
};