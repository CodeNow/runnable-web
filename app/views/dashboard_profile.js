var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'profile',
  events: {
    'click .edit-inline'      : 'editInline',
    'click .permission a'     : 'permissionToggle'
  },
  preRender: function () {
    if (this.options.editmode) this.className = 'editmode';
  },
  editInline: function (evt) {
    this.$(evt.currentTarget)
      .children('input')
      .focus();
  },
  permissionToggle: function (evt) {
    var $menuItem = this.$(evt.currentTarget);
    var $menuStatus = this.$('.permission > .glyphicon');
    if ($menuItem.hasClass('public')) {
      $menuStatus.prop('class','glyphicon glyphicon-eye-open');
    } else {
      $menuStatus.prop('class','glyphicon glyphicon-eye-close');
    }
  }
});

module.exports.id = "DashboardProfile";
