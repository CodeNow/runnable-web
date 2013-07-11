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
  },
  destroyById: function (containerId, callback) {
    var container = this.app.fetcher.modelStore.get('container', containerId, true);
    var options = utils.successErrorToCB(destroyCallback.bind(this));
    function destroyCallback(err, container) {
      if (err) {
        callback(err);
      }
      else {
        container.destroy(options);
        callback();
      }
    }
  }
});

if (global.window) global.window.dd = module.exports.destroyById

module.exports.id = "Container";
