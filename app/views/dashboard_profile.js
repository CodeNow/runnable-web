var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'profile',
  className: 'col-xl-offset-1 col-xl-2 col-sm-3',
  events: {
    'click .menu a' : 'permissionToggle',
    'change input'  : 'updateAttr',
    'submit form'   : 'preventDefault'
  },
  permissionToggle: function (evt) {
    var $menuItem = this.$(evt.currentTarget);
    var $menuStatus = this.$('.menu > .glyphicons');
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
  },
  preventDefault: function (evt) {
    evt.preventDefault();
    return false;
  }
});

module.exports.id = "DashboardProfile";
