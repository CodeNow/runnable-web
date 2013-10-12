var Implementation = require('../models/implementation'),
    Base = require('./base');

module.exports = Base.extend({
  model: Implementation,
  url: '/users/me/implementations'
});

module.exports.id = 'Implementations';