var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'profile',
  events: {
    'click .edit-inline' : 'editInline'
  },
  preRender: function () {
    if (this.options.editmode) this.className = 'editmode';
  },
  editInline: function (evt) {
    if (!this.options.editmode) return;
    var $thisInput = this.$(evt.currentTarget)
      .children('input')
      .focus();
  }
});

module.exports.id = "DashboardProfile";
