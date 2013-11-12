var _ = require('underscore');
var helpers = require('./helpers');
var fetchWithMe = helpers.fetchWithMe;
var formatTitle = helpers.formatTitle;
var canonical = helpers.canonical;

module.exports = {
  dashboard: function(params, callback) {
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
          owner: params.username // add api support
        }
      }
    };
    var self = this;
    fetch.call(this, spec, function (err, results) {
      if (err) return callback(err);
      if (results.users.length === 0) return callback({status:404});
      results.user = results.users.models[0];
      delete results.users;
      callback(null, addSEO(results));
    });
    function addSEO (results) {
      var user = results.user;
      results.page = {
        title    : formatTitle(user.get('username')+"'s Profile"),
        canonical: canonical.call(self)
      }
      return results;
    }
  }
};