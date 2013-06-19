var should = require("should");
var globals = require('rendr/shared/globals');
var env = require('../server/lib/env');
var Fetcher = require('rendr/shared/fetcher');
var adapter = require('../server/lib/data_adapter');
var server = require('rendr/server/server');

var User = require('../app/models/user');
var Users = require('../app/collections/users');

server.dataAdapter = new adapter(env.current.api);

describe('User', function() {

  it('should return 401 unauthorized if an access token is not cached on server', function (cb) {

    var user = new User({ }, {
      url: '/users/me',
      app: {
        req: {
          session: { } // no access token cached
        },
        fetcher: new Fetcher({ })
      }
    });

    user.fetch({
      success: function (model, response, options) {
        cb(new Error('should not return success'));
      },
      error: function (model, xhr, options) {
        xhr.should.have.property('status', 401);
        xhr.should.have.property('message', 'access token required');
        cb();
      }
    });

  });

  it('should be able to create a new user without an access token', function (cb) {

    var user = new User({ }, {
      urlRoot: '/users',
      app: {
        req: {
          session: { } // no access token cached
        },
        fetcher: new Fetcher({ })
      }
    });

    user.save({ }, {
      wait: true,
      success: function (model, response, options) {
        response.should.have.property('access_token');
        cb();
      },
      error: function (model, xhr, options) {
        cb(new Error('could not create user'));
      }
    });

  });


  it('should fetch a users information if a valid access token is provided', function (cb) {

    var user = new User({ }, {
      urlRoot: '/users',
      app: {
        req: {
          session: { } // no access token cached
        },
        fetcher: new Fetcher({ })
      }
    });

    user.save({ }, {
      success: function (model, response, options) {
        response.should.have.property('access_token');
        user.app.req.session = { access_token: response.access_token };
        user.url = '/users/me'
        user.fetch({
          success: function (model, response, options) {
            response.should.have.property('_id');
            cb();
          },
          error: function (model, xhr, options) {
            cb(new Error('should not return error on fetch()'));
          }
        })
      },
      error: function (model, xhr, options) {
        cb(new Error('should not return error on save()'));
      }
    });

  });

});