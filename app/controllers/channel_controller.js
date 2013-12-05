var _ = require('underscore');
var async = require('async');
var helpers = require('./helpers');
var utils = require('../utils');
var fetch = helpers.fetch;
var Channel = require('../models/channel');

var fetchOwnersFor = helpers.fetchOwnersFor;
var fetchUserAndChannel = helpers.fetchUserAndChannel;
var fetchChannelContents = helpers.fetchChannelContents;
var canonical = helpers.canonical;
var formatTitle = helpers.formatTitle;

module.exports = {
  index: function (params, callback) {
    params.page = utils.getQueryParam(this.app, 'page');
    params.sort = utils.getQueryParam(this.app, 'sort');
    var self = this;
    var app = this.app;
    async.waterfall([
      fetchUserAndChannel.bind(this, params.channel),
      function redirectCheck (channelResult, cb) {
        var channel = channelResult.channel;
        if (channel.get('name') !== params.channel)
          return self.redirectTo(channel.appUrl(params));
        cb(null, channelResult);
      },
      function (results, cb) {
        // default values AFTER redirect check
        fetchChannelContents.call(self, params, function (err, channelResults) {
          if (err) return cb(err);
          cb(null, _.extend(results, channelResults, {page:params.page}));
        });
      },
      function (results, cb) {
        results.channels.reset(results.channels.filter(function (channel) {
          return channel.get('count') !== 0;
        }));
        fetchOwnersFor.call(self, results.user, results.images, function (err, ownerResults) {
          if (err) return cb(err);
          cb(null, _.extend(results, ownerResults));
        });
      },
      function addSEO (results, cb) {
        var pageText = (params.page>1) ? " Page "+params.page : "";
        var sort = (params.sort) || 'created';
        results.page = {
          title: formatTitle(utils.sortLabel(sort)+' '+results.channel.get('name')+" code"+pageText),
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
    var self = this;
    var app = this.app;
    var isHomepage = utils.isCurrentUrl(app, '');
    params.category = params.category || 'Featured';
    var isFeaturedCategory = (params.category.toLowerCase() == 'featured');
    // if (isServer && !this.app.req.cookies.pressauth) {
    //   this.redirectTo('/');
    // }
    // else if (!isServer && !utils.clientGetCookie('pressauth')) {
    //   this.redirectTo('/');
    // }
    // else {
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
        if (err) {
          callback(err);
        }
        else {
          results.selectedCategoryLower = params.category.toLowerCase();
          results.selectedCategory = _.find(results.categories.models, function (category) {
            return category.get('name').toLowerCase() === results.selectedCategoryLower;
          });
          var catName = results.selectedCategory.get('name');
          if (isFeaturedCategory && !isHomepage) {
            self.redirectTo('');
          }
          else if (catName !== params.category) {
            self.redirectTo('/c/'+catName);
          }
          else {
            if (isFeaturedCategory) {
              results.channels.insert(2, utils.customChannel(app));
            }
            var featured = results.categories.findWhere({
              name: 'Featured'
            });
            featured.set('url', '/');
            callback(null, addSEO(results));
          }
        }
      });
      function addSEO (results) {
        var channel = params.channel;
        var category = params.category;
        var channelAndOrCategory = channel? channel+' in '+category : category;

        if (params.category.toLowerCase() == 'featured') {
          results.page = {
            title : 'Discover Everything through Code',
            canonical : 'http://runnable.com'
          };
        }
        else {
          results.page = {
            title : formatTitle(channelAndOrCategory+" Related Tags"),
            canonical : canonical.call(self)
          };
        }

        return results;
      }
    // }
  },
  all: function(params, callback) {
    params.page = utils.getQueryParam(this.app, 'page');
    params.sort = utils.getQueryParam(this.app, 'sort');
    var self = this;
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
          sort: '-created',
          page: (params.page && params.page-1) || 0,
          limit: 50
        }
      },
      channels: {
        collection : 'Channels',
        params     : {}
      }
    };
    async.waterfall([
      fetch.bind(this, spec),
      function owners (results, cb) {
        fetchOwnersFor.call(self, results.user, results.images, function (err, ownerResults) {
          cb(err, !err && _.extend(results, ownerResults));
        });
      },
      function extend (results, cb) {
        results.channels.reset(results.channels.filter(function (channel) {
          return channel.get('count') !== 0;
        }));
        results.channel = new Channel({name:'All'}, {app:self.app});
        var pageText = (params.page) ? " Page "+params.page : "";
        var sort = (params.sort) || 'created';
        results.page = {
          title: formatTitle(utils.sortLabel(sort)+' '+'Runnable code for JQuery, Codeigniter, NodeJS, PHP, Python and more'+pageText),
          description: utils.sortLabel(sort)+' '+'Runnable code for '+utils.tagsToString(results.channels.toJSON(), 'and'),
          canonical: canonical.call(self)
        };
        cb(null, results);
      }
    ],
    function (err, results) {
      callback(err, 'channel/index', results);
    });
  }
};
