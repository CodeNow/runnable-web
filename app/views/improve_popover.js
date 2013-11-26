var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'div',
  className: 'popover fade bottom',
  events: {
    'change select' : 'changeSelect'
  },
  changeSelect: function (evt) {
    var $category = this.$(evt.currentTarget);

    this.$('.selected')[0].innerHTML = $category[0].value;
  }
});

module.exports.id = "ImprovePopover";
