var BaseView = require('./base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  getTemplateData: function () {
    return _.extend(this.options, {
      prevLink: '',
      nextLink: '',
    });
  }
});

module.exports.id = "dashboard";