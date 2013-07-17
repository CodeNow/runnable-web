var Runnable = require('./runnable');
var _ = require('underscore');
var Super = Runnable.prototype;
var utils = require('../utils');

var Container = module.exports = Runnable.extend({
  urlRoot: '/users/me/runnables',
  saveAll: function (cb) {
    this.app.dispatch.trigger('saveAll', cb);
  },
  run: function (cb) {
    // if we aren't running, start
    debugger;
    if (!this.get('running')) {
      this.start(cb);
    } else {
      this.restart(cb);
    }
  },
  stop: function (cb) {
    var self = this;
    var options = utils.successErrorToCB(cb);
    options.wait = true;
    this.save({running: false}, options);
  },
  start: function (cb) {
    var self = this;
    this.saveAll(function (err) {
      if (err) {
        cb(err);
      }
      else {
        var options = utils.successErrorToCB(cb);
        options.wait = true;
        self.save({running: true}, options);
      }
    })
  },
  restart: function (cb) {
    var self = this;
    this.stop(function (err) {
      if (err) {
        cb(err);
      }
      else {
        self.start(cb);
      }
    })
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

if (global.window) global.window.dd = module.exports.destroyById;

module.exports.id = "Container";
