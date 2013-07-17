var BaseView = require('./base_view');

module.exports = BaseView.extend({
	tagName: 'p',
	className: 'author',
  getTemplateData: function () {
    return this.options;
  }
});

module.exports.id = "RunnableOwner";
