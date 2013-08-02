var BaseView = require('../base_view');

module.exports = BaseView.extend({
  getTemplateData: function () {
    this.options.categories.models.forEach(function (category) {
      attribs = category.attributes;
      attribs.link = '/c/'+attribs.name;
    });
    return this.options;
  }
});

module.exports.id = "channel/category";
