var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'profile',
  events: {
    'click .edit-inline' : 'editInline'
  },
  editInline: function (evt) {
    var $thisInput = this.$(evt.currentTarget)
      .children('input')
      .focus();
  }
});

module.exports.id = "DashboardProfile";
