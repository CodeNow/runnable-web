var _ = require('underscore');
var helpers = require('./helpers');
var fetchWithMe = helpers.fetchWithMe;

module.exports = {
  published: function(params, callback) {
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
          sort: 'votes',
          owner: 'me'
        }
      }
    };
    var self = this;
    fetchWithMe.call(this, spec, function (err, results) {
      if (err) {
        callback(err);
      } else {
        if (results.user.isVerified()) {
          callback(null, addSEO(results));
        } else {
          self.redirectTo('/me/drafts');
        }
      }
    });
    function addSEO (results) {
      if (!results) {
        return results;
      } else {
        return _.extend(results, {
          page: {
            title: "Runnable Dashboard",
            description: 'Runnable user dashboard listing runnables and their stats',
            canonical: "http://runnable.com/me/published"
          }
        });
      }
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
      containers: {
        collection : 'Containers',
        params     : {
          owner: 'me'
        }
      }
    };
    fetchWithMe.call(this, spec, function (err, results) {
      if (err) {
        callback(err);
      } else {
        callback(null, addSEO(results));
      }
    });
    function addSEO (results) {
      if (!results) {
        return results;
      } else {
        return _.extend(results, {
          page: {
            title: "Runnable Dashboard",
            description: 'Runnable user dashboard listing runnables and their stats',
            canonical: "http://runnable.com/me/drafts"
          }
        });
      }
    }
  },
};