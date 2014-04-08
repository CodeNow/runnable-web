var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'a',
  preRender: function () {
    var self = this;
    var opts = self.options;
    var name = opts.name;
    var editMode = opts.editmode;

    if (editMode) {
      self.className =  'can-edit';
    }
    else {
      self.attributes= {
        href: '/'+name
      };
    }
  }
});

module.exports.id = "TagLink";
