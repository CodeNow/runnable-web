var Base = require('./base');
var Super = Base.prototype;
module.exports = Base.extend({
  urlRoot: '/projects',
  // initialize: function () {

  //   return Super.initialize.apply(this, arguments);
  // }
});

module.exports.id = 'Project';