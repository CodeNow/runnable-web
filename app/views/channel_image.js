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
      //no icon-lg for til all images are in
      var pre = (opts.large) ? 'icon-' : (opts.tag) ? 'icon-tag-' : 'icon-';
      var src = '/images/provider-icons/:pre:lower.png'
        .replace(':pre', pre)
        .replace(':lower', lower);

      this.attributes = {
        src: src,
        alt: name,
        height: (opts.large) && 39
        // width: opts.width
      };
    }
    else {
      this.className='display-none';
    }
  },
  postRender: function () {
    this.$el.error(this.loadError);
  },
  loadError: function (evt) {
    $(evt.currentTarget).hide();
  }
});

module.exports.id = 'ChannelImage';