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
    var opts = utils.cbOpts(callback, ctx);
    container.destroy(opts);
  },
  appURL: function () {
    return '/me/'+this.id;
  },
  createFrom: function (imageIdOrChannelName, cb) {
    var app = this.app;
    var container = new Container({}, { app:app });
    var opts = utils.cbOpts(cb);
    opts.url = _.result(container, 'url') + '?from=' + encodeURIComponent(imageIdOrChannelName);
    container.save({}, opts);
  },
  githubImport: function (query, cb) {
    var opts = utils.cbOpts(cb);
    opts.url = utils.pathJoin('/api/-', this.urlRoot, 'import/github') +
      utils.toQueryString(query);
    this.save({}, opts);
  },
  killContainer: function(containerID, cb) {
    cb = cb || function () {};
    var self=this, app=this.app, auth, data, opts;
    var cbOpts = utils.cbOpts(cb);
    self.fetch({
      url: '/users/me/runnables/' + containerID + 'killMe',
      success: success,
      error: cbOpts.error
    });

    function success () {
      cbOpts.success.apply(this, arguments);
    }
  }
});

module.exports.id = "Container";
