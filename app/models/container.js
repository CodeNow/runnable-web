var Runnable = require('./runnable');
var _ = require('underscore');
var Super = Runnable.prototype;
var utils = require('../utils');

module.exports = Runnable.extend({
  urlRoot: '/users/me/runnables',
  run: function (runCB) {
    var options = utils.successErrorToCB(function (err, model) {
      runCB(err);
    });
    this.save({running: true}, options);
  }
  // virtuals: function () {
  //   var virtuals = _.clone(_.result(Super, 'virtuals'));
  //   return _.extend(virtuals, {});
  // }
});

module.exports.id = "Container";