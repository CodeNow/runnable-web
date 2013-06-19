var Users = require('../models/user')
  , Base = require('./base');

module.exports = Base.extend({
  model: Users,
  url: '/users'
});

module.exports.id = 'Users';