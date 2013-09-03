var BaseView = require('./base_view');
var channelImages = require('../channelImages');

module.exports = BaseView.extend({
  tagName: 'img',
  preRender: function () {
    var opts = this.options;
    var name = opts.name;
    var lower = name.toLowerCase();
    var src;
    if (lower in channelImages) {
      var pre = (opts.large) ? 'icon-lg-' : (opts.tag) ? 'tag-' : 'icon-';
      var src = '/image/:pre:lower.png'
        .replace(':pre', pre)
        .replace(':lower', lower);

      this.attributes = {
        src: src,
        alt: name,
        height: opts.height,
        width: opts.width
      };
    }
    else {
      this.className='display-none';
    }
  }
});

module.exports.id = 'ChannelImage';