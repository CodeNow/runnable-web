var Base = require('./base');
var Super = Base.prototype;

module.exports = Base.extend({
  urlRoot: '/implementations',
  constructor: function (attrs, options) {
    if (attrs) {
      var reqs = attrs.requirements;
      if (Array.isArray(reqs) && typeof reqs[0] == 'string') {
        attrs.requirements = req.map(utils.put({value:''}, 'name'))
      }
    }
    Super.constructor.apply(this, arguments);
  },
  appUrl: function () {
    return ["http://", this.get("subdomain"), ".", this.app.get('domain')].join('');
  }
});
module.exports.id = 'Implementation';