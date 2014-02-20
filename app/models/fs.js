var _ = require('underscore');
var Base = require('./base');
var utils = require('../utils');
var Super = Base.prototype;

// gets url from collection
module.exports = Base.extend({
  virtuals: {
    'fullPath' : 'fullPath'
  },
  isFile: function () {
    return (this.get('type') === 'file' || !this.get('dir'));
  },
  isDir: function () {
    return (this.get('type') === 'dir' || this.get('dir'));
  },
  isRootDir: function () {
    return (this.get('path') == '/' && this.get('name') === '');
  },
  fullPath: function () {
    return utils.pathJoin(this.get('path'), this.get('name'));
  },
  moveFromTo: function (fromCollection, toCollection, cb, ctx) {
    if (ctx) cb = cb.bind(ctx);
    if (fromCollection == toCollection) {
      cb(); // do nothing moving from/to same dir
    }
    else if (toCollection.findWhere({name:this.get('name')})) {
      cb(this.get('name')+' already exists in '+toCollection.params.path);
    }
    else if (this.isDir() && this.fullPath() === toCollection.params.path) {
      cb('cannot move folder to itself');
    }
    else {
      var newPath = toCollection.params.path;
      var options = utils.cbOpts(saveCallback, this);
      options.patch = true;
      this.save({ path:newPath }, options);
      // assume success
      fromCollection.remove(this);
      toCollection.add(this);
      var model = this; // not available in saveCallback..
      function saveCallback (err) {
        if (err) {
          // rollback if error
          toCollection.remove(model);
          fromCollection.add(model);
          cb(err);
        } else {
          cb(null, model, toCollection);
        }
      }
    }
  }
});

module.exports.id = "Fs";