var BaseView = require('../base_view');
var utils = require('../../utils');

module.exports = BaseView.extend({
  id:'providers',
  events: {
    'click #providers-text button' : 'scrollToPublishRequest'
  },
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
  },
  scrollToPublishRequest: function (evt) {
    evt.preventDefault();
    $('html, body').animate({
        scrollTop: this.$("#providers-register-form").offset().top
    }, 400);
  }
});

module.exports.id = "home/providers";
