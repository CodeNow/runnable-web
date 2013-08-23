var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  id: 'web',
  postInitialize: function () {
    if (this.model) {
      //first render..
      this.baseUrl = "http://" + this.model.get("webToken") + "." + this.app.get('domain');
    }
  },
  postHydrate: function () {
    //clientside
    var self = this;
    this.baseUrl = "http://" + this.model.get("webToken") + "." + this.app.get('domain');
    this.setIframeSrcPath('');
    window.addEventListener("message", function (event) {
      if (event.data === 'Refresh') {
        self.setIframeSrcPath('');
      }
    }, false);
    var dispatch = this.app.dispatch;
    if (dispatch) {
      this.listenTo(dispatch, 'ready:box', this.onBoxReady.bind(this));
    }
  },
  onBoxReady: function () {
    this.refresh();
    this.hideLoader();
  },
  postRender: function () {
    var navigationView = _.findWhere(this.childViews, {name:'web_navigation'});
    this.listenTo(navigationView, 'change:url', this.setIframeSrcPath.bind(this));
    this.$iframe = this.$('iframe');
    this.refresh(); // to prevent cache hit
  },
  refresh: function () {
    this.$iframe.attr('src', this.$iframe.attr('src'));
  },
  setIframeSrcPath: function (url) {
    if (url[0] !== '/') url = '/' + url;
    var fullUrl = this.baseUrl+url;
    this.$('iframe').attr('src', fullUrl);
  },
  getTemplateData: function () {
    return {
      url: this.baseUrl
    };
  },
  hideLoader: function () {
    this.$('.loading').hide();
  }
});

module.exports.id = "Web";
