var async = require('async');
var should = require("should");
var globals = require('rendr/shared/globals');
var env = require('../server/lib/env');
var faker = require('Faker');
var Fetcher = require('rendr/shared/fetcher');
var adapter = require('../server/lib/data_adapter');
var server = require('rendr/server/server');

var User = require('../app/models/user');
var Project = require('../app/models/project');
var Projects = require('../app/collections/projects');

server.dataAdapter = new adapter(env.current.api);
var fetcher = new Fetcher({ });

// fake applications

var app = {
  req: {
    session: { }
  },
  fetcher: fetcher
};

var app2 = {
  req: {
    session: { }
  },
  fetcher: fetcher
};

var user;
var user2;

before(function (cb) {

  async.parallel([
    function (cb) {
      user = new User({ }, { app: app, urlRoot: '/users', });
      user.save({ }, {
        wait: true,
        success: function () {
          cb()
        },
        error: function () {
          cb(new Error('could not create a new user'));
        }
      });
    },
    function (cb) {
      user2 = new User({ }, { app: app2, urlRoot: '/users', });
      user2.save({ }, {
        wait: true,
        success: function () {
          cb()
        },
        error: function () {
          cb(new Error('could not create a new user'));
        }
      });
    }
  ], cb);

});

after(function (cb) {

  async.parallel([
    function (cb) {
      user.destroy({
        success: function (model, response, options) {
          cb();
        },
        error: function (model, xhr, options) {
          cb(new Error('error destorying user'));
        }
      });
    },
    function (cb) {
      user2.destroy({
        success: function (model, response, options) {
          cb();
        },
        error: function (model, xhr, options) {
          cb(new Error('error destorying user'));
        }
      });
    }
  ], cb);

});

describe('Backbone', function() {

  it('should be able to create a new runnable with default framework (node.js)', function (cb) {

    var project = new Project({ }, { app: app });
    project.save({}, {
      success: function (model, xhr, body) {
        xhr.should.have.property('framework', 'node.js');
        cb();
      },
      error: function () {
        cb(new Error('error creating a new runnable'));
      }
    });

  });

  it('should be able to destroy a runnable', function (cb) {

    var project = new Project({ }, { app: app });
    project.save({}, {
      success: function (model, xhr, body) {
        project.destroy({
          success: function () {
            cb();
          },
          error: function () {
            cb(new Error('error destroying runnable'));
          }
        });
      },
      error: function () {
        cb(new Error('error creating a new runnable'));
      }
    });

  });

  it('should be able to list a users own runnables', function (cb) {

    async.series([
      function (cb) {
        var project = new Project({ }, { app: app });
        project.save({}, {
          success: function (model, xhr, body) {
            project.destroy({
              wait: true,
              success: function () {
                cb();
              },
              error: function () {
                cb(new Error('error destroying runnable'));
              }
            });
          },
          error: function () {
            cb(new Error('error creating a new runnable'));
          }
        });
      },
      function (cb) {
        var project = new Project({ }, { app: app });
        project.save({}, {
          success: function (model, xhr, body) {
            project.destroy({
              wait: true,
              success: function () {
                cb();
              },
              error: function () {
                cb(new Error('error destroying runnable'));
              }
            });
          },
          error: function () {
            cb(new Error('error creating a new runnable'));
          }
        });
      }
    ], cb);

  });

});