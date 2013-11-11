var _ = require('underscore');
var helpers = require('./helpers');
var fetchWithMe = helpers.fetchWithMe;
var formatTitle = helpers.formatTitle;
var canonical = helpers.canonical;

function dashboardData (cb) {
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
  fetchWithMe.call(this, spec, cb);
};

module.exports = {
  published: function(params, callback) {
    var self = this;
    dashboardData.call(this, function (err, results) {
      if (err) {
        callback(err);
      } else if (!results.user.isRegistered()) {
        self.redirectTo('/');
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
    var self = this;
    dashboardData.call(this, function (err, results) {
      if (err) {
        callback(err);
      } else if (!results.user.isRegistered()) {
        self.redirectTo('/');
      } else {
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
  profile: function (params, callback) {
    var spec = {
      user    : {
        model  : 'User',
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
      callback(null, addSEO(results));
    });
    function addSEO (results) {
      results.page = {
        title    : formatTitle('Published', 'Dashboard'),
        canonical: canonical.call(self)
      }
      return results;
    }
  }
};