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
  appURL: function (opts) {
    if (_.result(opts, 'noTags'))
      return '/'+this.id+'/'+utils.urlFriendly(this.get('name'));
    else
      return '/'+this.id+'/'+utils.urlFriendly(this.nameWithTags());
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
  },
  getFiles: function (fileStringsArr) {
    var lowerCaseFileNamesArr = fileStringsArr.map(function(f){return f.toLowerCase();});
    return this.get('files').filter(function(file){
      return (
        _.isString(file.name) &&
        _.isString(file.path) &&
        !file.dir             &&
        (lowerCaseFileNamesArr.indexOf(file.path.toLowerCase() + file.name.toLowerCase()) !== -1));
    });
  }
});

module.exports.id = "Image";