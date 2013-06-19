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

// fake application
var app = {
  req: {
    session: { }
  },
  fetcher: new Fetcher({ })
};

var user;

before(function (cb) {

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

});

after(function (cb) {

  user.destroy({
    success: function (model, response, options) {
      cb();
    },
    error: function (model, xhr, options) {
      cb(new Error('error destorying user'));
    }
  });

});

describe('Project', function() {

  it('should be able to create a new runnable with default framework (node.js)', function (cb) {

    var project = new Project({ }, { app: app });
    project.save({}, {
      wait: true,
      success: function (model, xhr, body) {
        xhr.should.have.property('framework', 'node.js');
        cb();
      },
      error: function () {
        cb(new Error('error creating a new runnable'));
      }
    });

  });

});