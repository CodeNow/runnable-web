var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  id: 'publish-loader',
  className: 'overlay-loader',
  postRender: function () {
    var i = 1, self = this, status = this.model.get('status');
    if (status !== 'Editing' && status !== 'Draft') {
      this.$el.show();
    }
    this.$('h1:first-child').addClass('in');

    var primus = new Primus('http://cybertron.' + this.app.get('domain'), { 
      transformer: 'engine.io' 
    });

    console.log('http://cybertron.' + this.app.get('domain'));
    var progress = this.model.get('servicesToken') + ':progress';

    primus.substream(progress).on('data', function onProgress (data) {
      console.log(progress, data);
      if (i < 5) {
        self.$('h1.in').prop('class','out');
        self.$('h1:nth-child(' + i + ')').addClass('in');
        i++;
      }
      if (data === 'Finished') {
        window.location = window.location;
      }
    });
    primus.substream('subscriptions').write(progress);
    console.log('SUB', progress);

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
