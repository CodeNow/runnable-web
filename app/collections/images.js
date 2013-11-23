var Image = require('../models/image');
var Runnables = require('./runnables');

module.exports = Runnables.extend({
  model: Image,
  url: '/runnables'
});

module.exports.id = "Images";