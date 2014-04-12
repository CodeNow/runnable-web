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
  },
  appUrl: function () {
    return '/'+this.id+'/'+utils.urlFriendly(this.nameWithTags());
  },
  appURL: function () { // kill this method! - be careful it is in use around the app
    return this.appUrl();
  },
  embeddedUrl: function () {
    return '/'+this.id+'/'+utils.urlFriendly(this.nameWithTags())+'/embedded';
  },
  /**
   * Arrange the 'tags' array in a spec order
   */
  sortChannels: function () {
    var active   = [],
        inactive = [];
    this.attributes.tags.forEach(function(item, i){
      (item.isActiveFilter) ? active.push(item) : inactive.push(item);
      return item;
    });
    var lowerCaseCompare = function(a, b){
      return a.name.toLowerCase() < b.name.toLowerCase();
    };
    active.sort(lowerCaseCompare);
    inactive.sort(lowerCaseCompare);
    this.attributes.tags = active.concat(inactive);
  }
});

module.exports.id = "Image";