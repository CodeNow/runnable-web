var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'a',
  preRender: function () {
    var self = this;
    var opts = self.options;
    var name = opts.name;
    var editMode = opts.editmode;
    var className = opts.className;

    if (editMode) {
      self.className = 'can-edit';
    }
    else {
      self.attributes= {
        href: '/'+name
      };
    }

    if (className) {
      self.className = 'tag';
    }
  }
});

module.exports.id = "TagLink";
