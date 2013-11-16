var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'profile',
  className: 'clearfix',
  events: {
    'click .edit-inline'      : 'editInline',
    'click .permission a'     : 'permissionToggle',
    'change input'            : 'updateAttr'
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
    var $menuStatus = this.$('.permission > .glyphicons');
    if ($menuItem.hasClass('public')) {
      $menuStatus.prop('class','glyphicons unlock');
      this.save('show_email', true);
    } else {
      $menuStatus.prop('class','glyphicons lock');
      this.save('show_email', false);
    }
  },
  updateAttr: function (evt) {
    var $input = $(evt.currentTarget);
    var attr = $input.attr('name');
    var val  = $input.val();
    this.save(attr, val);
  },
  save: function (attr, val) {
    var data = {};
    data[attr] = val;
    var opts = utils.cbOpts(this.showIfError, this);
    opts.patch = true;
    this.model.save(data, opts);
  }
});

module.exports.id = "DashboardProfile";
