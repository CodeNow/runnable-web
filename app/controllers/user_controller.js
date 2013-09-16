var _ = require('underscore');
var helpers = require('./helpers');
var fetchWithMe = helpers.fetchWithMe;
var formatTitle = helpers.formatTitle;
var canonical = helpers.canonical;

module.exports = {
  published: function(params, callback) {
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
    var self = this;
    fetchWithMe.call(this, spec, function (err, results) {
      if (err) {
        callback(err);
      } else if (!results.user.isVerified()) {
        self.redirectTo('/me/drafts');
      } else {
        callback(err, 'user/dashboard', addSEO(results));
      }
    });
    function addSEO (results) {
      results.page = {
        title    : formatTitle('Published', 'Dashboard'),
        canonical: canonical.call(self)
      }
      return results;
    }
  },
  drafts: function(params, callback) {
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
    var self = this;
    fetchWithMe.call(this, spec, function (err, results) {
      if (err) {
        callback(err);
      }
      else {
        callback(err, 'user/dashboard', addSEO(results));
      }
    });
    function addSEO (results) {
      results.page = {
        title    : formatTitle('Drafts', 'Dashboard'),
        canonical: canonical.call(self)
      }
      return results;
    }
  },
};