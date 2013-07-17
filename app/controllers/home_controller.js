var _ = require('underscore');
var utils = require('../utils');
var global = this;
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
          callback(err, _.extend(results, ownerResults));
        });
      }
    });
  },

  jobs: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
  },

  privacy: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
  },

  about: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
  },

  providers: function (params, callback) {
    var spec = {
      user: { model:'User', params:{_id: 'me'} }
    };
    fetch.call(this, spec, callback);
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
    fetch.call(this, spec, callback);
  }
};