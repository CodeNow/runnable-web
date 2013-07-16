var BaseView = require('./base_view');
var _ = require('underscore');

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
    this.setIframeSrcPath('');
    window.addEventListener("message", function (event) {
      if (event.data === 'Refresh') {
        self.setIframeSrcPath('');
      }
    }, false);
  },
  postRender: function () {
    var navigationView = _.findWhere(this.childViews, {name:'web_navigation'});
    this.listenTo(navigationView, 'change:url', this.setIframeSrcPath.bind(this));
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
  }
});

module.exports.id = "Web";
