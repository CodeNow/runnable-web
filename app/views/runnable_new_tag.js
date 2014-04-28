var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'li',
  id: 'new-tag',
  events: {
    'click .plus' : 'togglePopover'
  },
  togglePopover: function () {
    this.$('.popover').toggleClass('in');
  }
});

module.exports.id = "RunnableNewTag";
