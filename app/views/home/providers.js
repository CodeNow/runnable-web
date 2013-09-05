var BaseView = require('../base_view');

module.exports = BaseView.extend({
  id:'providers',
  postRender: function () {
    this.imageTile();
  },
  imageTile: function () {
    var $bubbleImages = this.$('.bubbles img');
    var max = $bubbleImages.length;
    var count = 0;
    $bubbleImages.each(function () {
      $(this).once('load', checkAllLoaded);
    });
    function checkAllLoaded () {
      if (++count >= max) done();
    }
    function done () {
      this.$('.bubbles').isotope({
        itemSelector : 'img',
        layoutMode   : 'masonry',
        itemPositionDataEnabled : true,
        transformsEnabled       : false,
        onLayout : function(){
          $bubbleImages.addClass('hero-animate');
        }
      });
    }
  }
});

module.exports.id = "home/providers";
