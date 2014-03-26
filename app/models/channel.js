var Base = require('./base');

module.exports = Base.extend({
  urlRoot: '/channels',
  hasAlias: function (checkAlias) {
  	if (Array.isArray(checkAlias)) {
  		return checkAlias.some(this.hasAlias.bind(this));
  	}
  	var lowerAlias = checkAlias.toLowerCase();
  	this.attributes.aliases = this.attributes.aliases || [];
  	return this.attributes.aliases.some(function (alias) {
  		return alias === lowerAlias;
  	});
  },
  appUrl: function () {
    return this.get('url') || '/'+this.get('name');
  }
});
module.exports.id = 'Channel';