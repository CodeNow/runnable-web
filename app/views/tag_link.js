var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'a',
  preRender: function () {
    var name = this.options.name;
    this.attributes= {
      href: '/'+name
    };
  }
});

module.exports.id = "TagLink";
