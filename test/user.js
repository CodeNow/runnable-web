var should = require("should");
var globals = require('rendr/shared/globals');
var env = require('../server/lib/env');
var faker = require('Faker');
var Fetcher = require('rendr/shared/fetcher');
var adapter = require('../server/lib/data_adapter');
var server = require('rendr/server/server');

var User = require('../app/models/user');
var Project = require('../app/models/project');

server.dataAdapter = new adapter(env.current.api);
var fetcher = new Fetcher({ });

describe('User', function() {

  it('should return 401 unauthorized if an access token is not cached on server', function (cb) {

    var user = new User({ }, {
      url: '/users/me',
      app: {
        req: {
          session: { } // no access token cached
        },
        fetcher: fetcher
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
        fetcher: fetcher
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


  it('should cache the access_token returned when a user is created', function (cb) {

    var user = new User({ }, {
      urlRoot: '/users',
      app: {
        req: {
          session: { } // no access token cached
        },
        fetcher: fetcher
      }
    });

    user.save({ }, {
      wait: true,
      success: function (model, response, options) {

        user.app.req.session.should.have.property('access_token');

        cb();
      },
      error: function (model, xhr, options) {
        cb(new Error('could not create user'));
      }
    });

  });

  it('should cache the access_token when a token is successfully granted', function (cb) {

    var email = faker.Internet.email();
    var user = new User({
      email: email,
      password: 'mypass'
    }, {
      urlRoot: '/users',
      app: {
        req: {
          session: { } // no access token cached
        },
        fetcher: fetcher
      }
    });

    user.save({ }, {
      wait: true,
      success: function (model, response, options) {

        user.app.req.session.should.have.property('access_token');

        var user2 = new User({
          email: email,
          password: 'mypass'
        }, {
          url: '/token',
          app: {
            req: {
              session: { }
            },
            fetcher: fetcher
          }
        });

        user2.save({ }, {
          wait: true,
          success: function (model, response, options) {
            response.should.have.property('access_token');
            user2.app.req.session.should.have.property('access_token');
            cb();
          },
          error: function (model, xhr, options) {
            cb(new Error('could not get an access token for user'));
          }
        });
      },
      error: function (model, xhr, options) {
        cb(new Error('could not create a new registered user'));
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
        fetcher: fetcher
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

  it('should be able to create a registered user', function (cb) {

    var email = faker.Internet.email();
    var user = new User({
      email: email,
      password: 'mypass'
    }, {
      urlRoot: '/users',
      app: {
        req: {
          session: { }
        },
        fetcher: fetcher
      }
    });

    user.save({ }, { wait: true });
    user.on('change', function () {
      var registered = user.isRegistered();
      registered.should.equal(true);
      cb();
    });

  });

  it('should be able to create an anonymous user', function (cb) {

    var user = new User({ }, {
      urlRoot: '/users',
      app: {
        req: {
          session: { }
        },
        fetcher: fetcher
      }
    });

    user.save({ }, { wait: true });
    user.on('change', function () {
      var registered = user.isRegistered();
      registered.should.equal(false);
      cb();
    });

  });

  it('should be able to register an anonymous user', function (cb) {

    var user = new User({ }, {
      urlRoot: '/users',
      app: {
        req: {
          session: { }
        },
        fetcher: fetcher
      }
    });

    user.save({ }, { wait: true });
    user.once('change', function () {
      var registered = user.isRegistered();
      registered.should.equal(false);

      var email = faker.Internet.email();
      user.register(email, '1234', function (err) {
        if (err) { cb(err); } else {
          var registered = user.isRegistered();
          registered.should.equal(true);
          cb();
        }
      });
    });
  });

  it('should report an error if user is already registered', function (cb) {

    var user = new User({ }, {
      urlRoot: '/users',
      app: {
        req: {
          session: { }
        },
        fetcher: fetcher
      }
    });

    user.save({ }, { wait: true });
    user.once('change', function () {
      var registered = user.isRegistered();
      registered.should.equal(false);

      var email = faker.Internet.email();
      user.register(email, '1234', function (err) {
        if (err) { cb(err); } else {
          var registered = user.isRegistered();
          registered.should.equal(true);
          user.register(email, '1234', function (err) {
            if (err) {
              err.should.equal('you are already registered');
              cb();
            } else {
              cb(new Error('should not allow user to register twice'));
            }
          });
        }
      });
    });

  });

  it('should report an error if email address already exists', function (cb) {

    var user = new User({ }, {
      urlRoot: '/users',
      app: {
        req: {
          session: { }
        },
        fetcher: fetcher
      }
    });

    var user2 = new User({ }, {
      urlRoot: '/users',
      app: {
        req: {
          session: { }
        },
        fetcher: fetcher
      }
    });

    var email = faker.Internet.email()
    user.save({
      email: email,
      password: 'mypass'
    }, { wait: true });

    user.once('change', function () {

      user2.save({
        email: email,
        password: '1234'
      },{
        wait: true,
        error: function (model, body, options) {
          body.should.have.property('message', 'user already exists');
          cb();
        },
        success: function () {
          cb(new Error('should not allow user to register with same email address'));
        }
      });

    });
  });


  it('should be able to vote on a runnable', function (cb) {

    var app = {
      req: {
        session: { }
      },
      fetcher: fetcher
    };

    var user = new User({ }, {
      urlRoot: '/users',
      app: app
    });

    var user2 = new User({ }, {
      urlRoot: '/users',
      app: {
        req: {
          session: { }
        },
        fetcher: fetcher
      }
    });

    // create user
    user.save({}, { wait: true });
    user.once('change', function () {

      // create 2nd user
      user2.save({}, { wait: true });
      user2.once('change', function () {

        // create a runnable
        var project = new Project({ }, { app: app });
        project.save({}, { wait: true });
        project.once('change', function() {

          // vote on first users runnable
          var voteCount =  project.get('votes');
          user2.vote(project, function (err) {
            if (err) { cb(new Error(err)); } else {
              project.get('votes').should.equal(1);
              should.exist(user2.votes.findWhere({ runnable:project.id }));
              cb();
            }
          });

        });

      });

    });

  });

  it('should not be able to vote twice on the same runnable', function (cb) {

    var app = {
      req: {
        session: { }
      },
      fetcher: fetcher
    };

    var user = new User({ }, {
      urlRoot: '/users',
      app: app
    });

    var user2 = new User({ }, {
      urlRoot: '/users',
      app: {
        req: {
          session: { }
        },
        fetcher: fetcher
      }
    });

    // create user
    user.save({}, { wait: true });
    user.once('change', function () {

      // create 2nd user
      user2.save({}, { wait: true });
      user2.once('change', function () {

        // create a runnable
        var project = new Project({ }, { app: app });
        project.save({}, { wait: true });
        project.once('change', function() {

          // vote on first users runnable
          user2.vote(project, function (err) {
            if (err) { cb(new Error(err)); } else {

              // vote on first users runnable
              user2.vote(project, function (err) {
                if (err) {
                  err.should.equal('You have already voted on this project')
                  cb();
                } else {
                  cb(new Error('should not be able to vote twice'));
                }
              });

            }
          });

        });

      });

    });

  });


});