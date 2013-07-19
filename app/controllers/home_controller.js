var _ = require('underscore');
var utils = require('../utils');
var helpers = require('./helpers');

var fetch = helpers.fetch;
var fetchOwnersFor = helpers.fetchOwnersFor;

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
              title: 'Runnable code examples for JQuery, Codeigniter, NodeJS, Express and more',
              description: 'Runnable code examples for '+results.channels.toJSON().join(', ')+', and more',
              canonical: 'http://runnable.com/'
            }
          }));
        });
      }
    });
  },

  jobs: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, _.extend(results, {
        page: {
          title: 'Runnable Jobs',
          description: 'Runnable Job Postings and Listings',
          canonical: 'http://runnable.com/jobs'
        }
      }));
    });
  },

  privacy: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, _.extend(results, {
        page: {
          title: 'Runnable Privacy Policy',
          description: 'Runnable',
          canonical: 'http://runnable.com/privacy'
        }
      }));
    });
  },

  about: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, _.extend(results, {
        page: {
          title: 'About Runnable',
          description: 'About Runnable as a company and its team members',
          canonical: 'http://runnable.com/about'
        }
      }))
    });
  },

  providers: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, _.extend(results, {
        page: {
          title: 'Runnable API Providers Contact',
          description: 'Runnable API providers contact page',
          canonical: 'http://runnable.com/providers'
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
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, function (err, results) {
      callback(err, _.extend(results, {
        page: {
          title: 'Runnable',
          description: 'Runnable',
          canonical: 'http://runnable.com/blob'
        }
      }));
    });
  }
};