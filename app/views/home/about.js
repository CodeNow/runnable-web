var BaseView = require('../base_view');
var feedbackThanks = require('../modals/feedback_thanks');
var queryString = require('query-string');

module.exports = BaseView.extend({
  id:'about',
  events: {
    'submit form': 'submit'
  },
  submit: function (evt) {
    evt.preventDefault();
    var data = this.$(evt.currentTarget).serialize();

    $.post(
      '/api/-/emails',
      queryString.parse(data),
      function () { /* we don't care */ });

    this.$('form').addClass('in');
  },
  postRender: function () {
    setTimeout(function () {
      $.stellar();
    }, 100); // timeout for clientside hit, else doesnt work..
    // Getting images embedded in an SVG to show up in Safari...
    // http://stackoverflow.com/questions/12513308/svg-used-as-background-image-loses-embed-images
    function loadSVG(svgpath){
      if( /webkit/gi.test(navigator.userAgent.toLowerCase()) ){
        var obj = document.createElement("object");
        obj.setAttribute("type", "image/svg+xml");
        obj.setAttribute("data", svgpath);
        obj.setAttribute("width", "1");
        obj.setAttribute("height", "1");
        obj.setAttribute("style", "width: 0px; height: 0px; position: absolute; visibility: hidden");
        document.getElementsByTagName("html")[0].appendChild(obj);
      }
    }
    window.onload = function(){
      loadSVG("/images/about-press.svg");
    }
  }
});

module.exports.id = "home/about";
