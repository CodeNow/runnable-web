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
    // if we aren't running, start
    if (!this.get('running')) {
      this.save({running: true}, {
        wait: true,
        success: function (resp, body, model) {
          console.log('start successful');
          runCB();
        },
        error: function (resp, body, model) {
          console.log('start failed');
          runCB();
        }
      });
    } else {
      // if we are already running then do a restart
      var self = this;
      this.save({running: false}, {
        wait: true,
        success: function (resp, body, model) {
          self.save({running: true}, {
            wait: true,
            success: function (resp, body, model) {
              console.log('restart successful');
              runCB();
            },
            error: function (resp, body, model) {
              console.log('restart failed: could not restart process');
              runCB();
            }
          });
        },
        error: function (resp, body, model) {
          console.log('restart failed: could not stop process');
          runCB();
        }
      });

    }
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
