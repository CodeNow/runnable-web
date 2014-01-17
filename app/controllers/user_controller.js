var async = require('async');
var _ = require('underscore');
var helpers = require('./helpers');
var fetch = helpers.fetch;
var fetchUser = helpers.fetchUser;
var fetchWithMe = helpers.fetchWithMe;
var formatTitle = helpers.formatTitle;
var canonical = helpers.canonical;
var utils = require('../utils');
var helpers = require('./helpers');

var fetchPopUserAffectedChannels = helpers.fetchPopUserAffectedChannels;

function fetchRunnablesFor (userId, username, cb) {
  if (typeof username == 'function') {
    cb = username;
    username = false;
  }
  var spec = {
    published: {
      collection: 'Images',
      params: {
        owner: userId,
        limit: 200 // default limit is 25
      }
    },
    drafts: {
      collection: 'Containers',
      params: {
        saved: true,
        owner: userId,
        limit: 200 // default limit is 25
      }
    }
  };
  if (username) {
    spec.users = {
      collection : 'Users',
      params : {
        username: username
      }
    };
  }
  fetch.call(this, spec, cb);
}

function fetchProfileInfo (username, cb) {
  var spec = {
    users    : {
      collection : 'Users',
      params : {
        username: username
      }
    },
    published: {
      collection : 'Images',
      params     : {
        ownerUsername: username, // add api support
        limit: 200 // default limit is 25
      }
    }
  };
  fetch.call(this, spec, cb);
}

module.exports = {
  profile: function (params, callback) {
    var self = this;
    async.waterfall([
      fetchUser.bind(this),
      function (results, cb) {
        var currentUsername = (results.user.get('username') || '').toLowerCase();
        var viewingOwnProfile =  currentUsername === params.username.toLowerCase();
        results.editmode = viewingOwnProfile || results.user.isModerator(); //admin editmode override

        async.series([
          function (cb) {
            if (results.editmode) {
              var fetchUsername = false;
              if (viewingOwnProfile) {
                results.profileuser = results.user;
              }
              else if (results.user.isModerator()) {
                fetchUsername = params.username;
              }
              fetchRunnablesFor.call(self, results.user.id, fetchUsername, function (err, results2) {
                if (err) return cb(err);
                if (!viewingOwnProfile && results.user.isModerator()) {
                  results2.profileuser = results2.users.models[0];
                }
                results2.published.sortByAttr('-created');
                results2.drafts.sortByAttr('-created');
                _.extend(results, results2);
                cb();
              });
            }
            else {
              fetchProfileInfo.call(self, params.username, function (err, results2) {
                if (err) return cb(err);
                results2.profileuser = results2.users.models[0];
                delete results2.users;
                results2.published.sortByAttr('-created');
                _.extend(results, results2);
                cb();
              });
            }
          },
          function (cb) {
            if (!results.profileuser) return callback({status:404});
            cb();
          },
          function (cb) {
            fetchPopUserAffectedChannels.call(self, 3, results.profileuser.id, function (err, results3) {
              if (err) return cb(err);
              _.extend(results, results3);
              cb();
            });
          }
        ],
        function (err) {
          if (err) return cb(err);
          cb(null, results);
        });
      }
    ],
    function (err, results) {
      if (err) return callback(err);
      if (!results.profileuser) return callback({status:404});
      // redirect if url incorrect
      var profileUsername = results.profileuser.get('username');
      if (profileUsername !== params.username && !results.user.isModerator())
        return self.redirectTo('/u/'+profileUsername);
      callback(null, addSEO(results));
    });
    function addSEO (results) {
      var user = results.profileuser;
      var title = results.editmode && !results.user.isModerator() ?
        "Your Profile" :
        user.get('username')+"'s Profile";
      results.page = {
        title    : formatTitle(title),
        canonical: canonical.call(self)
      };
      return results;
    }
  }
};