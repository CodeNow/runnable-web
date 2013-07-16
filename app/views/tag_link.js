var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'a',
  preRender: function () {
    var name = this.options.data && this.options.data.name ||
      this.options.model && this.options.model.get('name');
    this.attributes= {
      href: '/'+name
    };
  },
  handleBrokenImages: function (evt) {
    this.$('img').each(function (i, img) {
      var clone = new Image();
      // clone.onerror = function () {};
      clone.onload = function () {
        var $img = $(img);
        $img.show();
      };
      clone.src = img.src;
    });
  },
  postRender: function () {
    this.handleBrokenImages();
  },
  getTemplateData: function () {
    var name = this.options.data && this.options.data.name ||
      this.options.model && this.options.model.get('name');
    return {name:name};
  }
});

module.exports.id = "TagLink";
