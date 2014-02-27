var BaseView = require('./base_view');
var channelImages = require('../channelImages');

module.exports = BaseView.extend({
  tagName: 'img',
  preRender: function () {
    var opts = this.options;
    var name = opts.name;
    var lower = name.toLowerCase();
    var src;
    lower = (lower in channelImages) ? lower : lower.replace(/ /g, '-');
    if ((lower in channelImages) && !opts.tag) {
      //no icon-lg for til all images are in
      var pre = (opts.large) ? 'icon-' : (opts.tag) ? 'icon-tag-' : 'icon-';

      var src = '/images/provider-icons/:pre:lower.svg'
        .replace(':pre', pre)
        .replace(':lower', lower);

      this.attributes = {
        src: src,
        alt: name,
        // width: opts.width
      };

      if (opts.large) {
        this.attributes.height = 39;
      }
    }
    else if (!opts.tag) {
      opts.firstletter = name[0];
      this.tagName = 'div';
      this.className = 'no-img btn purple';
    }
    else {
      this.className = 'display-none';
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