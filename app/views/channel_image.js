var BaseView = require('./base_view');
var channelImages = require('../channelImages');

module.exports = BaseView.extend({
  tagName: 'img',
  preRender: function () {
    var opts = this.options;
    var name = opts.name.toLowerCase();
    var nameSvg = name + '.svg';
    var alt = opts.alt;
    var src;

    name = (nameSvg in channelImages) ? name : name.replace(/ /g, '-');

    if ((nameSvg in channelImages) && !opts.tag) {
      var pre = (opts.large) ? 'icon-' : (opts.tag) ? 'icon-tag-' : 'icon-';
      var alt = (alt) ? '-alt' : '';
      var src = '/images/provider-icons/:pre:name:alt.svg'
        .replace(':pre',pre)
        .replace(':name',name)
        .replace(':alt',alt);

      this.attributes = {
        src: src,
        alt: name
      };
    }
    else {
      opts.firstletter = name[0].toUpperCase();
      this.tagName = 'div';
      this.className = 'out';
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