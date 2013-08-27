var _ = require('underscore');
var async = require('async');
var utils = require('../utils');
var channelController = require('./channel_controller');
var helpers = require('./helpers');

var fetch = helpers.fetch;
var fetchUser = helpers.fetchUser;
var fetchImplementation = helpers.fetchImplementation;
var fetchImplementations = helpers.fetchImplementations;
var fetchSpecification = helpers.fetchSpecification;
var fetchSpecifications = helpers.fetchSpecifications;
var fetchImage = helpers.fetchImage;
var fetchOwnerOf = helpers.fetchOwnerOf;
var fetchRelated = helpers.fetchRelated;
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
      var app = this.app;
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
          var imageURL = results.image.appURL();
          if (!utils.isCurrentURL(app, imageURL)|| params.channel) {
            self.redirectTo(imageURL);
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
          async.parallel([
            fetchFilesForContainer.bind(self, results.container.id),
            fetchOwnerOf.bind(self, results.image), //image owner
            fetchRelated.bind(self, results.image.id, results.container.attributes.tags)
          ],
          function (err, data) {
            cb(err, !err && _.extend(results, data[0], data[1], data[2]));
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
          console.log((new Error()).message);
          console.log((new Error()).stack);
        }
        if (err) { callback(err); } else {
          callback(null, addSEO(results, self.req));
        }
      });
      function addSEO (results) {
        var nameWithTags = results.image.nameWithTags();
        return _.extend(results, {
          page: {
            title      : nameWithTags,
            description: ['Runnable Code Example: ', nameWithTags].join(''),
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
        tags = tags ? ' for '+tags : '';
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
        if (container.get('specification')) {
          fetchImplementation.call(self, container.get('specification'), function (err, implementation) {
            if (err) { callback(err); } else {
              // IF NO IMPLEMENTATION DEAL WITH IT AS ERROR
              container.webToken = implementation.subdomain;
              callback(null, _.extend(results, {
                page: {
                  title: 'Output: ' + container.get('name'),
                  description: 'Web and console output for ' + container.get('name'),
                  canonical: canonical.call(self)
                }
              }));
            }
          });
        } else {
          callback(null, _.extend(results, {
            page: {
              title: 'Output: '+container.get('name'),
              description: 'Web and console output for '+container.get('name'),
              canonical: canonical.call(self)
            }
          }));
        }
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
      function getSpecifications (results, cb) {
        //merge into parallel
        fetchSpecifications.call(self, function (err, specifications) {
          if (err) {
            cb(err);
          } else {
            results.specifications = specifications;
            cb(null, results);
          }
        });
      },
      function getImplementations (results, cb) {
        //merge into parallel
        fetchImplementations.call(self, function (err, implementations) {
          if (err) {
            cb(err);
          } else {
            results.implementations = implementations;
            cb(null, results);
          }
        });
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
