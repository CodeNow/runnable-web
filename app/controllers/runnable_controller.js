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

module.exports = {
  index: function(params, callback) {
    var self = this;
    if (params._id.length != 16) {//TODO Re-implemented(!utils.isObjectId64(params._id)) {
      // redirect to channel page
      var channelParams = { channel:params._id };
      this.currentRoute.action= 'index';
      this.currentRoute.controller= 'channel';
      channelController.index.call(this, channelParams, callback);
    }
    else {
      var req = self.app.req;

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
          if (params.name != urlFriendlyName) {
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
            fetchRelated.bind(self, tags),
          ],
          function (err, data) {
            if (err) { cb(err); } else {
              console.log(results.image.owner);
              return _.extend(results, data[0], data[1], data[2]);
            }
          });
          fetchRelated.call(self, tags, function (err, relatedResults) {
            cb(err, _.extend(results, relatedResults));
          });
        },
      ], function (err, results) {
        callback(err, results);
      });
    }
  },
  'new': function (params, callback) {
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
  },
  newFrom: function(params, callback) {
    var self = this;
    async.waterfall([
      fetchUser.bind(this),
      function container (results, cb) {
        createContainerFrom.call(self, params.from, function (err, container) {
          if (err) { callback(err); } else {
            self.redirectTo('/me/'+container.id);
          }
        });
      }
    ], callback);
  },
  output: function (params, callback) {
    var self = this;
    fetchUserAndContainer.call(this, params._id, callback);
  },
  container: function (params, callback) {
    var self = this;
    async.waterfall([
      fetchUserAndContainer.bind(this, params._id),
      function parentImage (results, cb) {
        var imageId = results.container.get('parent');
        fetchImage.call(self, imageId, function (err, image) {
          cb(err, _.extend(results, {
            image: image
          }));
        });
      },
      function check404 (results, cb) {
        if (!results || !results.container) {
          cb({ status:404 });
        }
        else {
          cb(null, results);
        }
      },
      function files (results, cb) {
        fetchFilesForContainer.call(self, results.container.id, function (err, fileResults) {
          cb(err, _.extend(results, fileResults));
        });
      }
    ], callback);
  }
};
