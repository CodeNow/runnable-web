var _ = require('underscore');
var helpers = require('./helpers');
var utils = require('../utils');

var fetch = helpers.fetch;
var canonical = helpers.canonical;
var formatTitle = helpers.formatTitle;

module.exports = {
  jobs: function (params, callback) {
    var self = this;
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, !err && _.extend(results, {
        page: {
          title: formatTitle('Jobs'),
          description: formatTitle('Job Postings and Listings'),
          canonical: canonical.call(self)
        }
      }));
    });
  },

  privacy: function (params, callback) {
    var self = this;
    // var spec = {
    //   user: { model:'User', params:{_id: 'me'} }
    // };
    // fetch.call(this, spec, function (err, results) {
      var err = null;
      var results = {};
      callback(err, !err && _.extend(results, {
        page: {
          title: formatTitle('Privacy Policy'),
          canonical: canonical.call(self)
        }
      }));
    // });
  },

  maintenance: function (params, callback) {
    var self = this;
      var err = null;
      var results = {};
      callback(err, !err && _.extend(results, {
        page: {
          title: formatTitle('Maintenance Mode'),
          canonical: canonical.call(self)
        }
      }));
    // });
  },

  about: function (params, callback) {
    var self = this;
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, !err && _.extend(results, {
        page: {
          title: formatTitle('About', 'Company Information and Team Members'),
          canonical: canonical.call(self)
        }
      }));
    });
  },

  providers: function (params, callback) {
    var self = this;
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, !err && _.extend(results, {
        page: {
          title: formatTitle('API Providers Contact'),
          canonical: canonical.call(self)
        }
      }));
    });
  },

  logout: function () {
    if (!isServer) {
      // force serverside hit for clientside (pushstate)
      // so that session can be destroyed
      window.location = '/logout';
    }
    else {
      this.app.req.session.destroy();
      this.redirectTo('/');
    }
  }

  // blob: function (params, callback) {
  //   var self = this;
  //   var spec = {
  //     user: { model:'User', params:{_id: 'me'} }
  //   };
  //   fetch.call(this, spec, function (err, results) {
  //     callback(err, !err && _.extend(results, {
  //       page: {
  //         title: formatTitle('Runnable'),
  //         description: 'Runnable',
  //         canonical: canonical.call(self)
  //       }
  //     }));
  //   });
  // }
,
  index: function (params, callback) {
    var self = this;
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, !err && _.extend(results, {
        page: {
          title: 'Runnable',
          canonical: canonical.call(self)
        }
      }));
    });
  },
  press: function (params, callback) {
    var self = this;
    if (isServer && this.app.req.cookies.pressauth) {
      this.redirectTo('/c/Featured');
    }
    else if (!isServer && utils.clientGetCookie('pressauth')) {
      this.redirectTo('/c/Featured');
    }
    else {
      var spec = {
        user: { model:'User', params:{_id: 'me'} }
      };
      fetch.call(this, spec, function (err, results) {
        callback(err, !err && _.extend(results, {
          page: {
            title: 'Runnable',
            canonical: canonical.call(self)
          }
        }));
      });
    }
  },
  login: function (params, callback) {
    var self = this;
    if (isServer && this.app.req.cookies.pressauth) {
      this.redirectTo('/c/Featured');
    }
    else if (!isServer && utils.clientGetCookie('pressauth')) {
      this.redirectTo('/c/Featured');
    }
    else {
      var spec = {
        user: { model:'User', params:{_id: 'me'} }
      };
      fetch.call(this, spec, function (err, results) {
        callback(err, !err && _.extend(results, {
          page: {
            title: 'Runnable',
            canonical: canonical.call(self)
          }
        }));
      });
    }
  },
  signup: function (params, callback) {
    var self = this;
    if (isServer && this.app.req.cookies.pressauth) {
      this.redirectTo('/c/Featured');
    }
    else if (!isServer && utils.clientGetCookie('pressauth')) {
      this.redirectTo('/c/Featured');
    }
    else {
      var spec = {
        user: { model:'User', params:{_id: 'me'} }
      };
      fetch.call(this, spec, function (err, results) {
        callback(err, !err && _.extend(results, {
          page: {
            title: 'Runnable',
            canonical: canonical.call(self)
          }
        }));
      });
    }
  }
};
