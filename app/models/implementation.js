var Base = require('./base');
var Super = Base.prototype;
var utils = require('../utils');

module.exports = Base.extend({
  // urlRoot: '/users/me/implementations',
  urlRoot: '/users/me/implementations',
  constructor: function (attrs, options) {
    if (attrs) {
      var reqs = attrs.requirements;
      if (Array.isArray(reqs) && typeof reqs[0] == 'string') {
        attrs.requirements = reqs.map(utils.put({value:''}, 'name'))
      }
    }
    Super.constructor.apply(this, arguments);
  },
  appUrl: function () {
    return ["http://", this.get("subdomain"), ".", this.app.get('userContentDomain')].join('');
  },
  isComplete: function (specification) {
    return specification?
      this.isCompleteForSpecification(specification) :
      this.requirementsAreComplete();
  },
  isCompleteForSpecification: function (specification) {
    var reqHash = {};
    this.get('requirements').forEach(function (req) {
      reqHash[req.name] = req.value;
    });

    var specReqNames = specification.get('requirements');
    return specReqNames.every(function (name) {
      var value = reqHash[name];
      return utils.exists(value) && value !== '';
    });
  },
  requirementsAreComplete: function () {
    return this.get('requirements').every(function (req) {
      return utils.exists(req.value) && req.value !== '';
    });
  }
});
module.exports.id = 'Implementation';
