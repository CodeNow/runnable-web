var _ = require('underscore');
var async = require('async');
var utils = require('../utils');
var channelController = require('./channel_controller');
var helpers = require('./helpers');

var fetch = helpers.fetch;
var fetchUser = helpers.fetchUser;
var fetchImage = helpers.fetchImage;
var fetchRelated = helpers.fetchRelated;
var fetchOwnerOf = helpers.fetchOwnerOf;
var fetchUserAndImage = helpers.fetchUserAndImage;
var fetchUserAndContainer = helpers.fetchUserAndContainer;
var fetchFilesForContainer = helpers.fetchFilesForContainer;
var createContainerFrom = helpers.createContainerFrom;
var canonical = helpers.canonical;

module.exports = {
  index: function(params, callback) {
    var self = this;
    if (!utils.isObjectId64(params._id)) {
      var channelParams;
      if (utils.isObjectId64(params.name)) {
        // channel runnable page
        channelParams = { channel:params._id, _id:params.name };
        channelController.runnable.call(this, channelParams, callback);
      }
      else{
        // channel page
        channelParams = { channel:params._id };
        channelController.index.call(this, channelParams, function (err, results) {
          callback(err, 'channel/index', results);
        });
      }
    }
    else {
      async.waterfall([
        fetchUserAndImage.bind(this, params._id),
        function check404 (results, cb) {
          if (!results || !results.image) {
            cb({ status:404 });
          }
          else {
            cb(null, results);
          }
        },
        function nameInUrl (results, cb) {
          var image = results.image;
          var urlFriendlyName = utils.urlFriendly(results.image.get('name'));
          if (encodeURIComponent(params.name) !== urlFriendlyName || params.channel) {
            var urlWithName = [image.id, urlFriendlyName].join('/');
            self.redirectTo(urlWithName);
          }
          else {
            cb(null, results);
          }
        },
        function container (results, cb) {
          createContainerFrom.call(self, results.image.id, function (err, container) {
            cb(err, _.extend(results, {
              container: container
            }));
          });
        },
        function filesOwnerRelated (results, cb) {
          var tags = results.container.attributes.tags;
          async.parallel([
            fetchFilesForContainer.bind(self, results.container.id),
            fetchOwnerOf.bind(self, results.image), //image owner
            // fetchRelated.bind(self, tags)
          ],
          function (err, data) {
            if (err) { cb(err); } else {
              cb(null,  _.extend(results, data[0], data[1], {related:{models:[]}}));
            }
          });
        },
        function generatePermissions (results, cb) {
          results.permissions = {
            edit: results.image.attributes.owner === results.user.id ||
              results.user.attributes.permission_level >= 5,
            fork: results.image.attributes.owner !== results.user.id
          };
          cb(null, results);
        }
      ], function (err, results) {
        // DEBUG!
        if(err && err.status) {
          console.log(err.status);
          console.log((new Error()).stack);
        }
        if (err) { callback(err); } else {
          callback(null, addSEO(results, self.req));
        }
      });
      function addSEO (results) {
        var image = results.image;
        var tags = utils.tagsToString(image.get('tags'), 'and');
        tags = tags ? ' for '+tags : ''
        return _.extend(results, {
          page: {
            title      : image.get('name') + tags,
            description: ['Runnable Code Example: ', image.get('name'), tags].join(''),
            canonical: canonical.call(self)
          }
        });
      }
    }
  },
  'new': function (params, callback) {
    var self = this;
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
    fetch.call(this, spec, function (err, results) {
      if (err) { callback(err); } else {
        var tags = utils.tagsToString(results.channels, 'or');
        tags = tags ? ' for '+tags : ''
        callback(null, _.extend(results, {
          page: {
            title: 'Create a new runnable for JQuery, Codeigniter, NodeJS, Express and more',
            description: 'Create a new Runnable Code Example' + tags,
            canonical: canonical.call(self)
          }
        }));
      }
    });
  },
  newFrom: function(params, callback) {
    var self = this;
    async.waterfall([
      fetchUser.bind(this),
      function container (results, cb) {
        createContainerFrom.call(self, params.from, function (err, container) {
          if (err) { cb(err); } else {
            self.redirectTo('/me/'+container.id);
          }
        });
      }
    ], callback);
  },
  output: function (params, callback) {
    var self = this;
    fetchUserAndContainer.call(this, params._id, function (err, results) {
      if (err) { callback(err); } else {
        var container = results.container;
        callback(null, _.extend(results, {
          page: {
            title: 'Output: '+container.get('name'),
            description: 'Web and console output for '+container.get('name'),
            canonical: canonical.call(self)
          }
        }));
      }
    });
  },
  container: function (params, callback) {
    var self = this;
    async.waterfall([
      fetchUserAndContainer.bind(this, params._id),
      function check404 (results, cb) {
        if (!results || !results.container) {
          cb({ status:404 });
        }
        else {
          cb(null, results);
        }
      },
      function parentAndFiles (results, cb) {
        async.parallel([
          fetchImage.bind(self, results.container.get('parent')),
          fetchFilesForContainer.bind(self, results.container.id)
        ],
        function (err, data) {
          var container = results.container;
          cb(err, _.extend(results, { image:data[0] }, data[1], {
            page: {
              title: 'Unpublished: '+container.get('name'),
              description: 'Unpublished Runnable Example:' + container.get('name'),
              canonical: canonical.call(self)
            }
          }));
        });
      }
    ], callback);
  }
};
