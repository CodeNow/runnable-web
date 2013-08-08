var _ = require('underscore');
var helpers = require('./helpers');
var utils = require('../utils');
var fetch = helpers.fetch;

var fetchOwnersFor = helpers.fetchOwnersFor;
var fetchChannel = helpers.fetchChannel;
var canonical = helpers.canonical;

module.exports = {
  index: function(params, callback) {
    var spec = {
      user: {
        model  : 'User',
        params : {
          _id: 'me'
        }
      },
      images: {
        collection : 'Images',
        params     : {
          sort: 'votes',
          channel: params.channel,
          page: (params.page && params.page-1) || 0
        }
      },
      channels: {
        collection : 'Channels',
        params     : {
          channel: params.channel
        }
      },
      channel: {
        model : 'Channel',
        params: {
          name: params.channel
        }
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
            results = _.extend(results, ownerResults);
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
            title: "Runnable Code Examples for "+results.channel.get('name'),
            description: "Runnable Code Examples for "+results.channel.get('name'),
            canonical: canonical.call(self)
          }
        });
      }
    }
  },
  runnable: function (params, callback) {
    this.redirectTo(params._id +'/'+ params.name);
  },
  category: function (params, callback) {
    params.category = params.category || 'PHP';
    var self = this;
    var spec = {
      user: {
        model: 'User',
        params: {
          _id: 'me'
        }
      },
      channels: {
        collection: 'Channels',
        params: {
          category: params.category
        }
      },
      categories: {
        collection: 'Categories'
      }
    };
    fetch.call(this, spec, function (err, results) {
      if (err) { callback(err); } else {
        results.selectedCategoryLower = params.category.toLowerCase();
        results.selectedCategory = _.find(results.categories.models, function (category) {
          return category.get('name').toLowerCase() == results.selectedCategoryLower;
        });
        callback(null, addSEO(results))
      }
    });
    function addSEO (results) {
      var channel = params.channel;
      var category = params.category;
      var channelAndOrCategory = channel? channel+' in '+category : category;
      return _.extend(results, {
        page: {
          title: "Runnable Code Examples for "+channelAndOrCategory,
          description: "Runnable Code Examples for "+channelAndOrCategory,
          canonical: 'http://runnable.com/c/'+params.category
        }
      });
    }
  }
};