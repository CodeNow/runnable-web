var Base = require('./base');

module.exports = Base.extend({
  urlRoot: '/channels',
  appUrl: function () {
    return this.get('url') || '/'+this.get('name');
  }
});
module.exports.id = 'Channel';