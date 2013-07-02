var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName:'section',
  className:'content',
  getTemplateData: function () {
    var options = this.options;
    return _.extend(options, {
      imageJSON : options.image.toJSON(),
      editMode  : options.action === 'edit'
    });
  }
});

module.exports.id = "runnable/index";
