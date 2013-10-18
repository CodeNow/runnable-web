var Implementation = require('../models/implementation'),
    Base = require('./base');

module.exports = Base.extend({
  model: Implementation,
  url: '/users/me/implementations',
  hasCompleteImplementationFor: function (specification) {
    if (!specification) return true;
    var imp = this.findWhereImplements(specification);
    return imp && imp.isComplete(specification);
  },
  hasImplementationFor: function (specOrId) {
    return Boolean(this.findWhereImplements(specOrId));
  },
  findWhereImplements: function (specOrId) {
    var specId = (specOrId.id) ? specOrId.id : specOrId;
    return this.findWhere({
      'implements' : specId
    })
  }
});

module.exports.id = 'Implementations';