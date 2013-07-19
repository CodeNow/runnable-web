var _ = require('underscore');
var helpers = require('./helpers');
var utils = require('../utils');
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
        if (err) { callback(err); } else { // if err or no images found, go ahead and callback
          results =  _.extend(results, { channel:params.channel });
          results = addSEO(results);
          callback(null, results);
        }
      } else {
        fetchOwnersFor.call(self, results.images, function (err, ownerResults) {
          if (err) { callback(err); } else {
            results = _.extend(results, ownerResults, { channel:params.channel });
            results = addSEO(results);
            callback(null, results);
          }
        });
      }
    });
    function addSEO (results) {
      if (!results || !results.channel) {
        return results;
      }
      else {
        return _.extend(results, {
          page: {
            title: "Runnable Code Examples for "+results.channel,
            description: 'Runnable Job Postings and Listings',
            canonical: "http://runnable.com/"+results.channel
          }
        });
      }
    }
  }
};