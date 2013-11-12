var _ = require('underscore');
var helpers = require('./helpers');
var fetch = helpers.fetch;
var fetchWithMe = helpers.fetchWithMe;
var formatTitle = helpers.formatTitle;
var canonical = helpers.canonical;
var utils = require('../utils');

module.exports = {
  dashboard: function(params, callback) {
    var app = this.app;
    if (!utils.isCurrentURL(app, '/me/published') && !utils.isCurrentURL(app, '/me/drafts')) {
      return this.redirectTo('/me/drafts');
    }
    var self = this;
    var spec = {
      user    : {
        model  : 'User',
        params : {
          _id: 'me'
        }
      },
      published: {
        collection : 'Images',
        params     : {
          sort: 'votes',
          owner: 'me'
        }
      },
      drafts: {
        collection : 'Containers',
        params     : {
          owner: 'me'
        }
      }
    };
    fetchWithMe.call(this, spec, function (err, results) {
      if (err) return callback(err);
      if (!results.user.isRegistered()) return self.redirectTo('/');
      if (utils.isCurrentURL(app, '/me/published') && !results.user.isVerified)
        return self.redirectTo('/me/drafts');
      // no error, registered user
      results.published.sortByAttr('-created');
      results.drafts.sortByAttr('-created');
      callback(null, addSEO(results));
    });
    function addSEO (results) {
      results.page = {
        title    : formatTitle('Published', 'Dashboard'),
        canonical: canonical.call(self)
      }
      return results;
    }
  },
  profile: function (params, callback) {
    var spec = {
      user    : {
        model  : 'User',
        params : {
          _id: 'me'
        }
      },
      users    : {
        collection : 'Users',
        params : {
          username: params.username
        }
      },
      published: {
        collection : 'Images',
        params     : {
          sort: 'votes',
          ownerUsername: params.username // add api support
        }
      }
    };
    var self = this;
    fetch.call(this, spec, function (err, results) {
      if (err) return callback(err);
      if (results.users.length === 0)
        return callback({status:404});
      results.profileuser = results.users.models[0];
      delete results.users;
      results.published.sortByAttr('-created');
      callback(null, addSEO(results));
    });
    function addSEO (results) {
      var user = results.profileuser;
      results.page = {
        title    : formatTitle(user.get('username')+"'s Profile"),
        canonical: canonical.call(self)
      }
      return results;
    }
  }
};