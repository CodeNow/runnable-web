var BaseView = require('./base_view');

module.exports = BaseView.extend({
  getTemplateData: function () {
    this.options.nostats = this.collection instanceof require('../collections/containers');
    return this.options;
  }
});

module.exports.id = "DashboardRunnables";
