var BaseView = require('./base_view');

module.exports = BaseView.extend({
  id: 'web',
  getTemplateData: function () {
    return {
      url: "http://" + this.model.get("docker_id") + "." + this.app.get('domain')
    };
  }
});

module.exports.id = "Web";
