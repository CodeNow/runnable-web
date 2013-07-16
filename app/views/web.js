var BaseView = require('./base_view');

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
    this.baseUrl = "http://" + this.model.get("docker_id") + "." + this.app.get('domain');
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
