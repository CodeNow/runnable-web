var Specification = require('../models/specification'),
    Base = require('./base');

module.exports = Base.extend({
  model: Specification,
  url: '/specifications'
});

module.exports.id = 'Specifications';