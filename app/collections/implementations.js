var Implementation = require('../models/implementation'),
    Base = require('./base');

module.exports = Base.extend({
  model: Implementation,
  url: '/implementations'
});

module.exports.id = 'Implementations';