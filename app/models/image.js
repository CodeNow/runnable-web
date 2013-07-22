var _ = require('underscore');
var Runnable = require('./runnable');
var utils = require('../utils');
var Super = Runnable.prototype;
var Container = require('./container');

module.exports = Runnable.extend({
  urlRoot: '/runnables',
  defaults: {
    votes: 0
  },
  // virtuals: function () {
  //   var virtuals = _.clone(_.result(Super, 'virtuals'));
  //   return _.extend(virtuals, {
  //   });
  // },
  initialize: function () {
    Super.initialize.apply(this, arguments);
    var self = this;
    if (this.app && this.app.dispatch) {
      this.app.dispatch.on('copy', function () {
        var copies = self.get('copies') + 1;
        self.set('copies', copies);
        self.save();
        console.log('hmmm');
      });
      this.app.dispatch.on('paste', function () {
        var pastes = self.get('pastes') + 1;
        self.set('pastes', pastes);
        self.save();
      });
      this.app.dispatch.on('cut', function () {
        var cuts = self.get('cuts') + 1;
        self.set('cuts', cuts);
        self.save();
      });
    }
  },
  incVote: function () {
    var votes = this.get('votes') + 1;
    this.set('votes', votes);
    return this;
  },
  decVote: function () {
    var votes = this.get('votes') - 1;
    this.set('votes', votes);
    return this;
  },
  publishFromContainer: function (containerId, callback) {
    var app = this.app;
    var image = this;
    var url = _.result(image, 'url')+'?from='+containerId;
    var options = utils.successErrorToCB(saveCallback.bind(this));
    options = _.extend(options, {
      url: url
    });
    image.save({}, options);
    function saveCallback (err, image) {
      if (err) { callback(err); } else {
        //destroy container
        var container = new Container({}, {app:this.app}); // destroyById requires app.. so thats why we have to initialize a container instance here.
        container.destroyById(containerId, function () {}); // we dont care about the callback;
        callback(null, image);
      }
    }
  }
});

module.exports.id = "Image";