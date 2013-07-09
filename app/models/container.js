var Runnable = require('./runnable');
var _ = require('underscore');
var Super = Runnable.prototype;
var utils = require('../utils');

var Container = module.exports = Runnable.extend({
  urlRoot: '/users/me/runnables',
  run: function (runCB) {
    var options = utils.successErrorToCB(function (err, model) {
      runCB(err);
    });
    this.save({running: true}, options);
  }
});

module.exports.destroyById = function (containerId, cb) {
  var container = new Container({_id:containerId}, {app:this.app});
  var options = utils.successErrorToCb(cb);
  container.destroy(options);
};

module.exports.id = "Container";
