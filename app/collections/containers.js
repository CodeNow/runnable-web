var Container = require('../models/container');
var Base = require('./base');

module.exports = Base.extend({
  model: Container,
  url: '/users/me/runnables'
});

module.exports.id = "Containers";