var Base = require('./base');

module.exports = Base.extend({
  idAttribute: 'name',
  urlRoot: '/channels/categories'
});
module.exports.id = 'Category';