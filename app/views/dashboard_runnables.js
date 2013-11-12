var BaseView = require('./base_view');

module.exports = BaseView.extend({
  getTemplateData: function () {
    this.options.isimage = this.collection instanceof require('../collections/images');
    return this.options;
  }
});

module.exports.id = "DashboardRunnables";
