var Base = require('./base');

module.exports = Base.extend({
  idAttribute: 'name',
  urlRoot: '/channels'
});
module.exports.id = 'Channel';