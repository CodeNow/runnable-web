var BaseView = require('./base_view');
var channelImages = require('../channelImages');

module.exports = BaseView.extend({
  tagName: 'img',
  preRender: function () {
    var lower = this.options.name.toLowerCase();
    if (!Boolean(channelImages[lower])) {
      this.className="display-none";
    }
    else {
      this.attributes = {
        src: "/images/channels/"+lower+".png",
        img: lower
      };
    }
  }
});

module.exports.id = "ChannelImage";
