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
    //params.page = utils.getQueryParam(this.app, 'page');
    //params.sort = utils.getQueryParam(this.app, 'sort');

    params.filter = (utils.getQueryParam(this.app, 'filter')) ? utils.getQueryParam(this.app, 'filter') : [];
    params.page = (utils.getQueryParam(this.app, 'page')) ? utils.getQueryParam(this.app, 'page') : 1;
    params.page = parseInt(params.page);
    if(isNaN(parseInt(params.page))){
      self.redirectTo('');
      return;
    }
    params.page--;

    if(!_.isArray(params.filter))
      params.filter = [params.filter]

    params.filter.push(params.channel);
    params.filter = _.uniq(params.filter);

    var self = this;
    var app = this.app;
    async.waterfall([
      fetchUserAndChannel.bind(this, params.channel),
      function fetchFeeds (channelResult, callback) {

        var spec = {
          channels: {
            collection: 'Channels',
            params: {
              category: 'Featured'
            }
          },
          feedTrending: {
            collection: 'FeedsImages',
            params: {
              page: params.page,
              limit: 15,
              channel: params.filter
            }
          },
          feedPopular: {
            collection: 'images',
            params: {
              page: params.page,
              limit: 15,
              channel: params.filter,
              sort: '-runs'
            }
          }
        };

        fetch.call(self, spec, function (err, results) {

          if (err) {
            callback(err);
            return;
          }

          _.extend(results, channelResult);

          async.parallel([
            function(cb){
              fetchOwnersFor.call(self, results.user, results.feedTrending, function(err, results2){
                _.extend(results, results2);
                cb();
              });
            },
            function(cb){
              fetchOwnersFor.call(self, results.user, results.feedPopular, function(err, results2){
                _.extend(results, results2);
                cb();
              });
          }], function(err){

            results.relatedChannels = results.feedTrending.relatedChannels;
            results.filteringChannels = results.relatedChannels;




            // Don't display the current channel as an option in filters
            results.filteringChannels.each(function(item, i){
              item.attributes.display = (item.get('name') !== results.channel.get('name'))
              item.attributes.isActiveFilter = (params.filter.indexOf(item.get('name')) === -1) ? false : true;
            });

            var setIfActive = function (item, i){
              var channel = new Channel(item);
              item.isActiveFilter = channel.hasAlias(params.filter);
              item.display = true;
              if(item.isActiveFilter){
                if(channel.get('aliases').indexOf(params.channel.toLowerCase()) !== -1){
                  item.display = false;
                }
              }
            };
            results.feedTrending.each(function(item, i){
              item.get('tags').forEach(setIfActive);
              item.sortChannels()
            });
            results.feedPopular.each(function(item, i){
              item.get('tags').forEach(setIfActive);
              item.sortChannels();
            });




            _.extend(channelResult, results);

            if (err) console.log(err);
            callback(null, channelResult);
          });
        });

      },



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
    params.filter = (utils.getQueryParam(this.app, 'filter')) ? utils.getQueryParam(this.app, 'filter') : [];
    params.page = (utils.getQueryParam(this.app, 'page')) ? utils.getQueryParam(this.app, 'page') : 1;
    params.page = parseInt(params.page);
    if(isNaN(parseInt(params.page))){
      self.redirectTo('');
      return;
    }
    params.page--;

    if(!_.isArray(params.filter))
      params.filter = [params.filter];

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
        },
        feedTrending: {
          collection: 'FeedsImages',
          params: {
            page:  params.page,
            limit: 15,
            channel: params.filter
          }
        },
        feedPopular: {
          collection: 'images',
          params: {
            page: params.page,
            limit: 15,
            channel: params.filter,
            sort: '-runs'
          }
        }
      };
      fetch.call(this, spec, function (err, results) {
        if (err) {
          callback(err);
        }
        else {
          results.relatedChannels = results.feedTrending.relatedChannels;

          if (results.relatedChannels.length) {
            results.filteringChannels = results.relatedChannels;
          } else {
            results.filteringChannels = results.channels;
          }






          results.filteringChannels.each(function(item, i){
            item.attributes.display = true;
            item.attributes.isActiveFilter = (params.filter.indexOf(item.get('name')) === -1) ? false : true;
          });

          var setIfActive = function (item, i){
            var channel = new Channel(item);
            item.isActiveFilter = channel.hasAlias(params.filter);
            item.display = true;
          };
          results.feedTrending.each(function(item, i){
            item.get('tags').forEach(setIfActive);
            item.sortChannels()
          });
          results.feedPopular.each(function(item, i){
            item.get('tags').forEach(setIfActive);
            item.sortChannels();
          });






          results.selectedCategoryLower = params.category.toLowerCase();
          results.selectedCategory = _.find(results.categories.models, function (category) {
            return category.get('name').toLowerCase() === results.selectedCategoryLower;
          });
          var catName = results.selectedCategory.get('name');

          var featured = results.categories.findWhere({
            name: 'Featured'
          });
          featured.set('url', '/');

          async.parallel([
            function(cb){
              fetchOwnersFor.call(self, results.user, results.feedTrending, function(err, results2){
                _.extend(results, results2);
                cb();
              });
            },
            function(cb){
              fetchOwnersFor.call(self, results.user, results.feedPopular, function(err, results2){
                _.extend(results, results2);
                cb();
              });
          }], function(err){
            if (err) console.log(err);
            callback(null, addSEO(results));
          });

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
          sort: params.sort ? '-'+params.sort : '-created',
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
