var _ = require('underscore');
var async = require('async');
var helpers = require('./helpers');
var utils = require('../utils');
var fetch = helpers.fetch;
var Channel = require('../models/channel');
var queryString = require('query-string');

var fetchOwnersFor = helpers.fetchOwnersFor;
var fetchUserAndChannel = helpers.fetchUserAndChannel;
var fetchChannelContents = helpers.fetchChannelContents;
var canonical = helpers.canonical;
var formatTitle = helpers.formatTitle;

function safeQueryStringCanonical (opts) {
  var response = {
    orderBy: opts.orderBy
  };
  if (_.isArray(opts.filter) && opts.filter.length > 0) {
    response.filter = opts.filter
  }
  opts.page = parseInt(opts.page);
  if (_.isNumber(opts.page) && !_.isNaN(opts.page) && opts.page > 0) {
    response.page = opts.page;
  }
  return '?' + queryString.stringify(response);
}

module.exports = {
  // channel page
  index: function (params, callback) {
    params.filter = (utils.getQueryParam(this.app, 'filter')) ? utils.getQueryParam(this.app, 'filter') : [];
    params.page   = (utils.getQueryParam(this.app, 'page'))   ? utils.getQueryParam(this.app, 'page')   : 1;
    params.page   = parseInt(params.page);
    var canonicalPage   = params.page;

    if(isNaN(parseInt(params.page))){
      self.redirectTo('');
      return;
    }
    params.page--;

    if(!_.isArray(params.filter))
      params.filter = [params.filter]

    var canonicalFilter = JSON.parse(JSON.stringify(params.filter));
    params.filter.push(params.channel);
    params.filter = _.uniq(params.filter);

    var orderBy = utils.getQueryParam(this.app, 'orderBy');
    if(!orderBy || !orderBy.toLowerCase || (orderBy.toLowerCase() != 'trending' && orderBy.toLowerCase() != 'popular'))
      orderBy = 'trending';
    orderBy = orderBy.toLowerCase();

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
          }
        };

        if(orderBy === 'trending'){
          spec.feed = {
            collection: 'FeedsImages',
            params: {
              page: params.page,
              limit: 15,
              channel: params.filter
            }
          };
        } else {
          spec.feed = {
            collection: 'images',
            params: {
              page: params.page,
              limit: 15,
              channel: params.filter,
              sort: '-runs'
            }
          };
        }

        fetch.call(self, spec, function (err, results) {
          if (err) console.log(err);

          // results.user for fetchOwnersFor
          _.extend(results, channelResult);

          fetchOwnersFor.call(self, results.user, results.feed, function(err, results2){
            if (err) console.log(err);

            results.relatedChannels = results.feed.relatedChannels;
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
            results.feed.each(function(item, i){
              item.get('tags').forEach(setIfActive);
              item.sortChannels()
            });

            _.extend(results, results2);
            _.extend(channelResult, results);
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
      function addSEO (results, cb) {
        var pageText         = (params.page > 1) ? " Page "+params.page : "";
        var sort             = (params.sort) || 'created';
        results.orderByParam = orderBy;

        var qs2 = safeQueryStringCanonical({
          orderBy: orderBy,
          filter:  canonicalFilter,
          page:    canonicalPage
        });

        results.page = {
          title: formatTitle(utils.sortLabel(sort)+' '+results.channel.get('name')+" code"+pageText),
          canonical: canonical.call(self, '/' + params.channel + '/' + qs2)
        };
        cb(null, results);
      }
    ], callback);
  },
  runnable: function (params) {
    this.redirectTo(params._id +'/'+ params.name);
  },
  //index/home page
  category: function (params, callback) {
    var self               = this;
    var app                = this.app;
    var isHomepage         = utils.isCurrentUrl(app, '');
    var orderBy            = utils.getQueryParam(this.app, 'orderBy');
    params.category        = params.category || 'Featured';
    var isFeaturedCategory = (params.category.toLowerCase() == 'featured');
    params.filter          = (utils.getQueryParam(this.app, 'filter')) ? utils.getQueryParam(this.app, 'filter') : [];
    params.page            = (utils.getQueryParam(this.app, 'page'))   ? utils.getQueryParam(this.app, 'page')   : 1;
    params.page            = parseInt(params.page);
    var canonicalPage      = params.page;

    if(isNaN(parseInt(params.page))){
      self.redirectTo('');
      return;
    }
    params.page--;

    if(!_.isArray(params.filter))
      params.filter = [params.filter];

    var canonicalFilter = JSON.parse(JSON.stringify(params.filter));

    if(_.result(orderBy, 'toLowerCase') != 'popular'){
      orderBy = 'trending';
    }
    orderBy = orderBy.toLowerCase();

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

    if (orderBy === 'trending') {
      spec.feed = {
        collection: 'FeedsImages',
        params: {
          page: params.page,
          limit: 15,
          channel: params.filter
        }
      };
    } else {
      spec.feed = {
        collection: 'images',
        params: {
          page: params.page,
          limit: 15,
          channel: params.filter,
          sort: '-runs'
        }
      };
    }

    fetch.call(this, spec, function (err, results) {
      if (err) {
        callback(err);
      }
      else {
        results.relatedChannels = results.feed.relatedChannels;

        if (results.relatedChannels.length) {
          results.filteringChannels = results.relatedChannels;
        } else {
          results.filteringChannels = results.channels;
        }

        results.filteringChannels.each(function(item, i){
          item.set('display', true);
          item.set('isActiveFilter', (params.filter.indexOf(item.get('name')) !== -1));
        });

        var setIfActive = function (item, i){
          var channel = new Channel(item);
          item.isActiveFilter = channel.hasAlias(params.filter);
          item.display = true;
        };
        results.feed.each(function(item, i){
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

        fetchOwnersFor.call(self, results.user, results.feed, function(err, results2){
          if (err) console.log(err);
          _.extend(results, results2);
          callback(null, addSEO(results));
        });

      }
    });
    function addSEO (results) {
      var channel = params.channel;
      var category = params.category;
      var channelAndOrCategory = channel? channel+' in '+category : category;

      results.orderByParam = orderBy;

      var qs2 = safeQueryStringCanonical({
        orderBy: orderBy,
        filter:  canonicalFilter,
        page:    canonicalPage
      });

      if (params.category.toLowerCase() == 'featured') {
        results.page = {
          title:     ((params.filter.length) ? (utils.tagsToString(params.filter) + ' - ') : '') + 'Runnable - Discover Everything through Code',
          canonical: 'http://runnable.com/' + qs2
        };
      }
      else {
        results.page = {
          title : formatTitle(channelAndOrCategory+" Related Tags"),
          canonical : canonical.call(self, '/' + qs2)
        };
      }
      return results;
    }
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
