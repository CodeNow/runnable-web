var _ = require('underscore');
var async = require('async');
var helpers = require('./helpers');
var utils = require('../utils');
var fetch = helpers.fetch;

var fetchOwnersFor = helpers.fetchOwnersFor;
var fetchUserAndChannel = helpers.fetchUserAndChannel;
var fetchChannelContents = helpers.fetchChannelContents;
var canonical = helpers.canonical;

module.exports = {
  index: function(params, callback) {
    var self = this;
    var lowerChannel = params.channel.toLowerCase();
    async.waterfall([
      fetchUserAndChannel.bind(this, params.channel),
      function redirectCheck (channelResult, cb) {
        var channelName = channelResult.channel.get('name');
        if (channelName !== params.channel) {
          var url = '/'+ channelName + ((params.page) ? '/page/'+params.page : '');
          self.redirectTo(url);
        }
        else {
          cb(null, channelResult);
        }
      },
      function (channelResult, cb) {
        fetchChannelContents.call(self, params.channel, params.page, function (err, results) {
          cb(err, !err && _.extend(results, channelResult));
        });
      }.bind(this),
      function (results, cb) {
        if (results.images.length === 0) {
          cb(null, results);
        } else {
          fetchOwnersFor.call(self, results.images, function (err, ownerResults) {
            cb(err, !err && _.extend(results, ownerResults));
          });
        }
      },
      function addSEO (results, cb) {
        results.page = {
          title: "Runnable Code Examples for "+results.channel.get('name'),
          description: "Runnable Code Examples for "+results.channel.get('name'),
          canonical: canonical.call(self)
        };
        cb(null, results);
      }
    ], callback);
  },
  runnable: function (params) {
    this.redirectTo(params._id +'/'+ params.name);
  },
  category: function (params, callback) {
    params.category = params.category || 'Featured';
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
          return category.get('name').toLowerCase() === results.selectedCategoryLower;
        });
        callback(null, addSEO(results));
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