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
var formatTitle = helpers.formatTitle;
var fetchUserAndSearch = helpers.fetchUserAndSearch;
var fetchOwnersFor = helpers.fetchOwnersFor;
var fetchLeaderBadges = helpers.fetchLeaderBadges;

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
        function data (cb) {
          var spec = {
            user: {
              model:'User',
              params:{
                _id: 'me'
              }
            },
            image: {
              model : 'Image',
              params: {_id:params._id}
            },
            specifications: {
              collection: 'Specifications',
              params: {}
            },
            implementations: {
              collection: 'Implementations',
              params: {}
            }
          };
          fetch.call(self, spec, cb);
        },
        function nameInUrl (results, cb) {
          var imageURL = results.image.appURL();
          if (!utils.isCurrentUrl(app, imageURL)|| params.channel) {
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
          var channelIds = results.container.get('tags').map(utils.pluck('channel'));
          async.parallel([
            fetchFilesForContainer.bind(self, results.container.id),
            fetchOwnerOf.bind(self, results.user, results.image), //image owner
            fetchRelated.bind(self, results.image.id, results.container.attributes.tags),
            fetchLeaderBadges.bind(self, 2, results.image.get('owner'), channelIds)
          ],
          function (err, data) {
            if (err) return cb(err);
            _.extend(results, data[0], data[1], data[2], data[3]);
            cb(null, results);
          });
        },
        // function anonCheck (results, cb) {
        //   // remove implementations for anon users
        //   if (!results.user.isRegistered()) {
        //     results.implementations.reset([]);
        //   }
        //   cb(null, results);
        // }
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
    }
    function addSEO (results) {
      return _.extend(results, {
        page: {
          title : formatTitle(results.image.nameWithTags()+" Code Example"),
          canonical: canonical.call(self)
        }
      });
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
        params: {
          category: 'frameworks'
        }
      },
      channels2: {
        collection : 'Channels',
        params: {
          category: 'languages'
        }
      }
    };
    fetch.call(this, spec, function (err, results) {
      if (err) { callback(err); } else {
        var tags = utils.tagsToString(results.channels, 'or');
        tags = tags ? ' for '+tags : '';
        results.channels.add(results.channels2.toArray());
        delete results.channels2;
        // results.channels.insert(1, utils.customChannel(this.app));
        callback(null, _.extend(results, {
          page: {
            title: formatTitle('Create a New Example for JQuery, Codeigniter, NodeJS, PHP, Python, Ruby, C++, Java and more'),
            description: 'Create a New Code Example' + tags,
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
              container.set('webToken', implementation.get('subdomain'));
              callback(null, _.extend(results, {
                page: {
                  title: 'Output: ' + results.container.nameWithTags(),
                  description: 'Web and console output for ' + container.get('name'),
                  canonical: canonical.call(self)
                }
              }));
            }
          });
        } else {
          callback(null, _.extend(results, {
            page: {
              title: 'Output: '+results.container.nameWithTags(),
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
      function data (cb) {
        var spec = {
          user: {
            model:'User',
            params:{
              _id: 'me'
            }
          },
          container: {
            model : 'Container',
            params: {_id:params._id}
          },
          specifications: {
            collection: 'Specifications',
            params: {}
          },
          implementations: {
            collection: 'Implementations',
            params: {}
          }
        };
        fetch.call(self, spec, cb);
      },
      function check404 (results, cb) {
        if (!results || !results.container) {
          cb({ status: 404 });
        }
        else {
          if (results.container.get('status') === 'Finished') {
            console.log('REDIRECT', '/' + results.container.get('child'));
            self.redirectTo('/' + results.container.get('child'));
          } else {
            cb(null, results);
          }
        }
      },
      // function anonCheck (results, cb) {
      //   // remove implementations for anon users
      //   if (!results.user.isRegistered()) {
      //     results.implementations.reset([]);
      //   }
      //   cb(null, results);
      // },
      function parentAndFiles (results, cb) {
        async.parallel([
          fetchImage.bind(self, results.container.get('parent')),
          fetchFilesForContainer.bind(self, results.container.id)
        ],
        function (err, data) {
          var container = results.container;
          cb(err, _.extend(results, { image:data[0] }, data[1], {
            page: {
              title: formatTitle('Unpublished: '+results.container.nameWithTags()),
              description: 'Unpublished Runnable Example:' + container.get('name'),
              canonical: canonical.call(self)
            }
          }));
        });
      }
    ], callback);
  },
  search: function(params, callback) {
    var self = this;
    var searchText = params.q || ' ';
    async.waterfall([
      fetchUserAndSearch.bind(this, searchText),
      function (results, cb) {
        if (results.images.length === 0) {
          cb(null, results);
        } else {
          fetchOwnersFor.call(self, results.user, results.images, function (err, ownerResults) {
            cb(err, !err && _.extend(results, ownerResults));
          });
        }
      },
      function addSEO (results, cb) {
        var pageText = searchText;
        results.page = {
          title: 'Search Results for ',
          canonical: canonical.call(self)
        };
        cb(null, results);
      }
    ], callback);
  },
  lock: function(params, callback) {
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
          var imageURL = results.image.appURL();
          if (!utils.isCurrentUrl(app, imageURL)|| params.channel) {
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
            fetchOwnerOf.bind(self, results.user, results.image), //image owner
            fetchRelated.bind(self, results.image.id, results.container.attributes.tags)
          ],
          function (err, data) {
            cb(err, !err && _.extend(results, data[0], data[1], data[2]));
          });
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
    }
    function addSEO (results) {
      return _.extend(results, {
        page: {
          title      : formatTitle(results.image.nameWithTags()+" Code Example"),
          canonical: canonical.call(self)
        }
      });
    }
  },
  lockterminal: function (params, callback) {
    fetchUser.call(this, function (err, results) {
      if (err) {callback(err);} else {
        results.page={
          title: 'Terminal: too much load!',
          canonical: canonical.call(this)
        };
        callback(null, results);
      }
    });
  }
,
};
