var Image = require('../models/image')
  , Base = require('./base');

module.exports = Base.extend({
  model: Image,
  url: '/runnables'
});

module.exports.id = "Images";