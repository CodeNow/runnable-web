var _ = require('underscore');
var utils = require('../utils');
var helpers = require('./helpers');

var fetch = helpers.fetch;
var fetchOwnersFor = helpers.fetchOwnersFor;
var canonical = helpers.canonical;

module.exports = {
  index: function(params, callback) {
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
          page: (params.page && params.page-1) || 0
        }
      },
      channels: {
        collection : 'Channels',
        params     : {}
      }
    };
    var self = this;
    fetch.call(this, spec, function (err, results) {
      if (err || results.images.length === 0) {
        // if err or no images found, go ahead and callback
        callback(err, results);
      } else {
        fetchOwnersFor.call(self, results.images, function (err, ownerResults) {
          callback(err, _.extend(results, ownerResults, {
            page: {
              title: 'Runnable code examples for JQuery, Codeigniter, NodeJS, Express, Python and more',
              description: 'Runnable code examples for '+utils.tagsToString(results.channels.toJSON(), 'and'),
              canonical: canonical.call(self)
            }
          }));
        });
      }
    });
  },

  jobs: function (params, callback) {
    var self = this;
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, _.extend(results, {
        page: {
          title: 'Runnable Jobs',
          description: 'Runnable Job Postings and Listings',
          canonical: canonical.call(self)
        }
      }));
    });
  },

  privacy: function (params, callback) {
    var self = this;
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, _.extend(results, {
        page: {
          title: 'Runnable Privacy Policy',
          description: 'Runnable',
          canonical: canonical.call(self)
        }
      }));
    });
  },

  about: function (params, callback) {
    var self = this;
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, _.extend(results, {
        page: {
          title: 'About Runnable',
          description: 'About Runnable as a company and its team members',
          canonical: canonical.call(self)
        }
      }))
    });
  },

  providers: function (params, callback) {
    var self = this;
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, _.extend(results, {
        page: {
          title: 'Runnable API Providers Contact',
          description: 'Runnable API providers contact page',
          canonical: canonical.call(self)
        }
      }));
    });
  },

  logout: function () {
    if (utils.exists(global.window)) {
      // force serverside hit for clientside (pushstate)
      // so that session can be destroyed
      window.location = '/logout';
    }
    else {
      this.app.req.session.destroy();
      this.redirectTo('/');
    }
  },

  blob: function (params, callback) {
    var self = this;
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, _.extend(results, {
        page: {
          title: 'Runnable',
          description: 'Runnable',
          canonical: canonical.call(self)
        }
      }));
    });
  }
};
