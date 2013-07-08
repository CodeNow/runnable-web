var Runnable = require('./runnable');
var _ = require('underscore');
var Super = Runnable.prototype;

module.exports = Runnable.extend({
  urlRoot: '/users/me/runnables',
  // virtuals: function () {
  //   var virtuals = _.clone(_.result(Super, 'virtuals'));
  //   return _.extend(virtuals, {});
  // }
});

module.exports.id = "Container";