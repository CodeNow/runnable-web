var BaseView = require('./base_view');
var _ = require('underscore');
var utils = require('../utils');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  id: 'web',
  postInitialize: function () {
    if (this.model) {
      //first render..
      this.baseUrl = "http://" + this.model.get("docker_id") + "." + this.app.get('domain');
    }
  },
  postHydrate: function () {
    //clientside
    var self = this;
    this.baseUrl = "http://" + this.model.get("docker_id") + "." + this.app.get('domain');
    var dispatch = this.app.dispatch;
    if (dispatch) {
      this.loading(true);
      this.listenTo(dispatch, 'ready:box', this.onBoxReady.bind(this));
    }
  },
  postRender: function () {
    var navigationView = _.findWhere(this.childViews, {name:'web_navigation'});
    this.listenTo(navigationView, 'change:url', this.setIframeSrcPath.bind(this));
    this.$iframe = this.$('iframe');
  },
  onBoxReady: function () {
    //first url set
    this.setIframeSrcPath('');
    this.$iframe.load(this.loading.bind(this, false));
  },
  refresh: function () {
    this.$iframe.attr('src', this.$iframe.attr('src'));
  },
  setIframeSrcPath: function (url) {
    this.loading(true);
    if (url[0] !== '/') url = '/' + url;
    var fullUrl = this.baseUrl+url;
    this.$('iframe').attr('src', fullUrl);
  },
  loading: function (bool) {
    if (utils.exists(bool)) {
      if (bool) {
        if (!this.nprogress){
          this.nprogress = require('nprogress').create(); // donot require this serverside! it will crash
          this.nprogress.configure({ el:this.el, showSpinner:false });
          this.nprogress.start();
        }
      }
      else {
        this.nprogress.done();
        this.nprogress = null;
      }
    }
    return Super.loading.apply(this, arguments);
  }
});

module.exports.id = "Web";
