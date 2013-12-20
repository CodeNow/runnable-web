var Runnable = require('./runnable');
var _ = require('underscore');
var Super = Runnable.prototype;
var utils = require('../utils');

var Container = module.exports = Runnable.extend({
  urlRoot: '/users/me/runnables',
  saveOpenFiles: function (cb, ctx) {
    this.app.dispatch.trigger('save:files', cb, ctx);
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
