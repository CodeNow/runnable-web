var RendrBase = require('rendr/shared/base/collection');
var Super = RendrBase.prototype;

module.exports = RendrBase.extend({
  parse: function (response) {
    if (this.parseDebug)
      console.log(response)
    return Super.parse.apply(this, arguments);
  },
});
