var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  className: 'terminal-view relative loading',
  postRender: function () {
    this.$('iframe').load(this.loading.bind(this, false));
  },
  getTemplateData: function () {
    this.options.url = "http://" + this.model.get("servicesToken") + "." + this.app.get('domain') + "/static/term.html"
    return this.options;
  }
});

module.exports.id = "Terminal";
