var BaseView = require('./base_view');
var channelImages = require('../channelImages');

module.exports = BaseView.extend({
  tagName: 'img',
  preRender: function () {
    var name = this.options.name;
    var lower = name.toLowerCase();
    if (lower in channelImages) {
      this.attributes = {
        src: "/images/icon-"+lower+".png",
        alt: name,
        height: this.options.height,
        width: this.options.width
      };
    }
    else {
      this.className="display-none";
    }
  }
});

module.exports.id = "ChannelImage";
