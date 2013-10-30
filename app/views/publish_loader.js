var BaseView = require('./base_view');

module.exports = BaseView.extend({
  id: 'publish-loader',
  className: 'overlay-loader',
  postRender: function () {
    // listen to events
    this.initLoading();
    // on event 1 call event1

    var i = 2;
    this.$('h1:first-child').addClass('in');
    function testLoop(){
      setTimeout(function(){
        this.$('h1.in').prop('class','out');
        this.$('h1:nth-child(' + i + ')').addClass('in');
        i++;
        if (i < 5) {
          testLoop();
        } else if (i === 5) {
          //sim error on last step
          setTimeout(function(){
            this.$('#progress-error').addClass('in');
          },4000);
        }
      },4000);
    };
    $('#pubwarn-back-button, #pubwarn-new-button').on('click',function(){
      testLoop();
    });
    //restart on cancel
    this.$('#progress-steps > a').on('click',function(){
      $('#publish-loader').hide();
      $('h1, #progress-error').removeClass('out in')
      i = 1;
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
