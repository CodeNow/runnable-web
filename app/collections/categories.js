var Base = require('./base');
var Category = require('../models/category');

module.exports = Base.extend({
  url: '/categories',
  model: Category
});
module.exports.id = 'Categories';