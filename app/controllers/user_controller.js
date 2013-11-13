var async = require('async');
var _ = require('underscore');
var helpers = require('./helpers');
var fetch = helpers.fetch;
var fetchUser = helpers.fetchUser;
var fetchWithMe = helpers.fetchWithMe;
var formatTitle = helpers.formatTitle;
var canonical = helpers.canonical;
var utils = require('../utils');

function fetchRunnablesFor (userId, cb) {
  var spec = {
    published: {
      collection: 'Images',
      params: {
        owner: userId,
        limit: 100 // default limit is 25
      }
    },
    drafts: {
      collection: 'Containers',
      params: {
        owner: userId,
        limit: 100 // default limit is 25
      }
    }
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
        limit: 100 // default limit is 25
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
        var currentUsername = (results.user.get('username') || '').toLowerCase()
        var viewingOwnProfile =  currentUsername === params.username.toLowerCase();

        results.editmode = viewingOwnProfile;
        if (viewingOwnProfile) {
          results.profileuser = results.user;
          fetchRunnablesFor.call(self, results.user.id, function (err, results2) {
            if (err) return cb(err);
            results2.published.sortByAttr('-created');
            results2.drafts.sortByAttr('-created');
            cb(null, _.extend(results, results2));
          });
        }
        else {
          fetchProfileInfo.call(self, params.username, function (err, results2) {
            if (err) return cb(err);
            results2.profileuser = results2.users.models[0];
            delete results2.users;
            results2.published.sortByAttr('-created');
            cb(null, _.extend(results, results2));
          });
        }
      }
    ],
    function (err, results) {
      if (err) return callback(err);
      var profileUsername = results.profileuser.get('username');
      if (profileUsername !== params.username)
        return self.redirectTo('/u/'+profileUsername);
      callback(null, addSEO(results));
    });
    function addSEO (results) {
      var user = results.profileuser;
      var title = results.editmode ?
        "Your Profile" :
        user.get('username')+"'s Profile";
      results.page = {
        title    : formatTitle(title),
        canonical: canonical.call(self)
      }
      return results;
    }
  }
};