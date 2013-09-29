var Base = require('./base');

module.exports = Base.extend({
  urlRoot: '/categories',
  appUrl: function () {
    return '/c/'+this.get('name');
  }
});
module.exports.id = 'Category';