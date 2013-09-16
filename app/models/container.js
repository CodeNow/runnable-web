var Runnable = require('./runnable');
var _ = require('underscore');
var Super = Runnable.prototype;
var utils = require('../utils');

var Container = module.exports = Runnable.extend({
  urlRoot: '/users/me/runnables',
  saveAll: function (cb, ctx) {
    this.app.dispatch.trigger('saveAll', cb, ctx);
  },
  run: function (cb, ctx) {
    // if we aren't running, start
    if (!this.get('running')) {
      this.start(cb, ctx);
    } else {
      this.restart(cb, ctx);
    }
  },
  stop: function (cb, ctx) {
    if (ctx) cb = cb.bind(ctx);
    var self = this;
    var options = utils.cbOpts(cb);
    options.wait = true;
    this.save({running: false}, options);
  },
  start: function (cb, ctx) {
    if (ctx) cb = cb.bind(ctx);
    this.saveAll(function (err) {
      if (err) {
        cb(err);
      }
      else {
        var options = utils.cbOpts(cb);
        options.wait = true;
        this.save({running: true}, options);
      }
    }, this)
  },
  restart: function (cb, ctx) {
    this.stop(function (err) {
      if (err) {
        cb.call(ctx, err);
      }
      else {
        this.start(cb, ctx);
      }
    }, this);
  },
  destroyById: function (containerId, callback, ctx) {
    var container = this.app.fetcher.modelStore.get('container', containerId, true);
    var options = utils.cbOpts(callback, ctx);
    container.destroy(options);
  },
  appURL: function () {
    return '/me/'+this.id;
  }
});

if (global.window) global.window.dd = module.exports.destroyById;

module.exports.id = "Container";
