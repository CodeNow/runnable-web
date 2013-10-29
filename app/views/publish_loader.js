var BaseView = require('./base_view');

module.exports = BaseView.extend({
  id: 'publish-loader',
  className: 'overlay-loader',
  postRender: function () {
    // listen to events
    this.initLoading();
    // on event 1 call event1

    this.$('h1:first-child').addClass('in');
    var i = 2;
    function testLoop(){
      setTimeout(function(){
        this.$('h1.in').prop('class','out');
        this.$('h1:nth-child(' + i + ')').addClass('in');
        i++;
        if (i < 5) {
          testLoop();
        }
      },4000);
    };
    testLoop();

    //#progress-error
    $('#progress-steps > a').on('click',function(){
      $('#progress-error').toggleClass('in');
    });

  },
  initLoading: function () {
  },
  stoppedVirtualMachine: function () {
    this.options.step2 = true;
    this.render();
  }
});

module.exports.id = "PublishLoader";
