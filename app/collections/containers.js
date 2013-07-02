var Container = require('../models/container');
var Base = require('./base');
var FileCollection = require('../collections/files');
var DirModel = require('./dir');

module.exports = Base.extend({
  model: Container,
  url: '/users/me/runnables'
});

module.exports.id = "Containers";