var RendrBase = require('rendr/shared/base/collection');
var Super = RendrBase.prototype;
var _ = require('underscore')

module.exports = RendrBase.extend({
  initialize: function (attrs, options) {
    Super.initialize.apply(this, arguments);
    if (options) {
      _.extend(this, _.pick(options, 'params'));
    }
  },
  parse: function (response) {
    if (this.debugParse) {
      console.log(response);
    }
    return Super.parse.apply(this, arguments);
  },
});
