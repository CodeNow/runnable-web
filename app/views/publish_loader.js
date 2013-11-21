var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  id: 'publish-loader',
  className: 'overlay-loader',
  postRender: function () {
    // listen to events
    // on event 1 call event1

    var i = 1, self = this;
    this.$('h1:first-child').addClass('in');
    // function testLoop(){
    //   setTimeout(function(){
    //     this.$('h1.in').prop('class','out');
    //     this.$('h1:nth-child(' + i + ')').addClass('in');
    //     i++;
    //     if (i < 5) {
    //       testLoop();
    //     } else if (i === 5) {
    //       //sim error on last step
    //       setTimeout(function(){
    //         this.$('#progress-error').addClass('in');
    //       },4000);
    //     }
    //   },4000);
    // };
    // $('#pubwarn-back-button, #pubwarn-new-button').on('click',function(){
    //   testLoop();
    // });
    // //restart on cancel
    // this.$('#progress-steps > a').on('click',function(){
    //   $('#publish-loader').hide();
    //   $('h1, #progress-error').removeClass('out in')
    //   i = 1;
    // });

    var primus = new Primus('http://cybertron.' + this.app.get('domain'));

    console.log('http://cybertron.' + this.app.get('domain'));

    primus.substream('done').on('data', console.log.bind(console, 'done:'));
    primus.substream('subscriptions').write('done');

    primus.substream('progress').on('data', function onProgress (data) {
      console.log('progress:', data);
      if (i < 5) {
        self.$('h1.in').prop('class','out');
        self.$('h1:nth-child(' + i + ')').addClass('in');
        i++;
      }
      if (data === 'Finished') {
        window.location = window.location;
      }
    });
    primus.substream('subscriptions').write('progress');

  },
  initLoading: function (type, cb) {
    var opts = utils.cbOpts(callback, this);
    opts.patch = true;
    var data = {
      status: 'Committing ' + type
    };
    this.model.save(data, opts);
    function callback (err, model) {
      if (err) {
        cb(err);
      } else {
        console.log('COMMIT INIT SUCCESS');
        this.$el.show();
      }
    }
  },
  stoppedVirtualMachine: function () {
    this.options.step2 = true;
    this.render();
  }
});

module.exports.id = "PublishLoader";
