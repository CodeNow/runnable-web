var BaseView = require('../base_view');

module.exports = BaseView.extend({
  id: 'output',
  postRender:  function () {
    var $ = this.$;
    $( "#output-results-container" ).resizable({
      alsoResizeReverse: "#output-terminal-container",
      handles: "s",
      start: function () {
        $(".resizable-iframe").each(function (index, element) {
          var d = $('<div class="iframe-cover" style="z-index:1000000;position:absolute;width:100%;top:0px;left:0px;bottom:0;"></div>');
          $(element).append(d);
        });
      },
      stop: function (e, ui) {
        $('.iframe-cover').remove();
        var parent = $(window);
        $('.resizable-iframe').each(function(){
          $(this).css({
            width : $(this).width()  / parent.width()  * 100 + "%" ,
            height: $(this).height() / parent.height() * 100 + "%"
          });
        });
      }
    });
    $( "#output-terminal-container" ).resizable();
  }
});

module.exports.id = "runnable/output";
