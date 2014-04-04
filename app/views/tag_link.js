var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'a',
  className: 'tag',
  preRender: function () {
    var self = this;
    var opts = self.options;
    var name = opts.name;
    var editMode = opts.editmode;
    var active = opts.active;

    if (editMode) {
      self.className =  'tag can-edit';
    }
    else {
      self.attributes= {
        href: '/'+name
      };
    }

    if (active) {
      self.className = 'tag active';
    }
  }
});

module.exports.id = "TagLink";
