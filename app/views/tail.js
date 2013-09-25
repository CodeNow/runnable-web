var BaseView = require('./base_view');
var Super = BaseView.prototype;

module.exports = BaseView.extend({
  id: 'output-terminal-container',
  className: 'resizable-iframe loading',
  getTemplateData: function () {
    this.options.url = "http://" + this.model.get("servicesToken")+ "." + this.app.get('domain') + "/static/log.html";
    return this.options;
  },
  postRender: function () {
    this.$iframe = this.$('iframe');
    this.$iframe.load(this.loading.bind(this, false));
  }
});

module.exports.id = "Tail";
