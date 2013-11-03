var BaseView = require('./base_view');
var _ = require('underscore');
var utils = require('../utils');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  id: 'output-results-container',
  className: 'resizable-iframe',
  getTemplateData: function () {
    this.options.baseurl = "http://" + this.model.get("webToken") + "." + this.app.get('domain');
    return this.options;
  },
  postHydrate: function () {
    this.options.buildmessage = this.options.buildmessage || false; //init
    this.listenTo(this.app.dispatch, 'toggle:buildMessage', this.toggleBuildMessage);
  },
  toggleBuildMessage: function (bool) {
    if (this.options.buildmessage !== bool) {
      this.options.buildmessage = bool;
      this.render();
    }
  },
  postRender: function () {
    this.listenTo(this.app.dispatch, 'change:url', this.setUrl.bind(this));
    this.$iframe = this.$('iframe');
    // iframe loader
    this.loading(true);
    this.$iframe.load(this.loading.bind(this, false)); // load event remains attached, for subsequent page loads
    this.appUrl();
  },
  refresh: function () {
    this.$iframe.attr('src', this.$iframe.attr('src'));
  },
  appUrl: function () {
    this.setUrl(this.options.baseurl);
  },
  setUrlPath: function (path) {
    this.loading(true);
    if (path[0] !== '/') path = '/' + path;
    var url = this.options.baseurl+path;
    this.$iframe.attr('src', url);
  },
  setUrl: function (url) {
    this.loading(true);
    this.$('iframe').attr('src', url);
  },
  loading: function (bool) {
    if (utils.exists(bool)) {
      if (bool) {
        this.ifNotThenShowProgress();
      }
      else {
        this.ifNotThenShowProgress();
        this.progressDone();
      }
    }
    return Super.loading.apply(this, arguments);
  },
  ifNotThenShowProgress: function () {
    if (!this.nprogress) {
      this.nprogress = require('nprogress').create(); // donot require this serverside! it will crash
      this.nprogress.configure({ el:this.el, showSpinner:false });
      this.nprogress.start();
    }
  },
  progressDone: function () {
    this.nprogress.done();
    this.nprogress = null;
  }
});

module.exports.id = "Web";
