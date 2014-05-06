var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'li',
  id: 'new-tag',
  events: {
    'click' : 'togglePopover'
  },
  togglePopover: function () {
    this.$('.popover').toggleClass('in');
    this.$('.popover input[name="name"]').focus();
  }
});

module.exports.id = "RunnableNewTag";
