var BaseView = require('../base_view');
var utils = require('../../utils');

module.exports = BaseView.extend({
  id:'providers',
  postRender: function () {
    this.imageTile();
  },
  imageTile: function () {
    var $bubbles = this.$('.bubbles');
    utils.allImagesLoaded($bubbles.find('img'), function () {
      $bubbles.isotope({
        itemSelector : 'img',
        layoutMode   : 'masonry',
        itemPositionDataEnabled : true,
        transformsEnabled       : false,
        onLayout : function(){
          $bubbles.find('.bubble').addClass('hero-animate');
        }
      });
    });
  }
});

module.exports.id = "home/providers";
