var BaseView = require('../base_view');
var _ = require('underscore');

module.exports = BaseView.extend({
  tagName:'section',
  className:'content',
  getTemplateData: function () {
    var options = this.options;
    var project = options.project;
    return _.extend(options, {
      projectJSON: project.toJSON(),
      editMode   : options.editMode || project.get('unpublished')
    });
  }
});

module.exports.id = "project/index";
