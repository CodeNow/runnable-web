var _ = require('underscore');
var helpers = require('./helpers');
var utils = require('../utils');

var fetch = helpers.fetch;
var canonical = helpers.canonical;
var formatTitle = helpers.formatTitle;

module.exports = {
  dashboard: function (params, callback) {
    var self = this;
    var app = this.app;

    var spec = {
      user    : {
        model  : 'User',
        params : {
          _id: 'me'
        }
      },
      activeRunnables    : {
        collection  : 'Admin',
        params : {
          state: 'active'
        }
      }
    };

    fetch.call(this, spec, function (err, results) {
      if (err) { callback(err); } else {

        callback(err, !err && _.extend(results, {
          page: {
            title: 'Admin Panel',
            description: formatTitle('Dashboard'),
            canonical: canonical.call(self)
          }
        }));
      }
    });

  }
};
