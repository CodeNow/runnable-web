var _ = require('underscore');
var BaseView = require('./base_view');
var _super = BaseView.prototype;

module.exports = BaseView.extend({
  tagName:'li',
  handleBrokenImages: function (evt) {
    var self = this;
    this.$('img').each(function (i, img) {
      var clone = new Image();
      // clone.onerror = function () {};
      clone.onload = function () {
        var $img = $(img);
        self.$('span.img').hide();
        $img.show();
      };
      clone.src = img.src;
    });
  },
  postRender: function () {
    this.handleBrokenImages();
  },
  getTemplateData: function () {
    return this.options;
  }
});

module.exports.id = 'ChannelItemView';