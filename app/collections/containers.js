var Container = require('../models/container');
var Runnables = require('./runnables');

module.exports = Runnables.extend({
  model: Container,
  url: '/users/me/runnables'
});

module.exports.id = "Containers";