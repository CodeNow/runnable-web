var RendrBase = require('rendr/shared/base/model');
var _ = require('underscore');
var Super = RendrBase.prototype;

module.exports = RendrBase.extend({
  idAttribute: '_id',
  virtuals: {},
  toJSON: function () {
    var data = Super.toJSON.call(this);
    var virtuals = _.result(this, 'virtuals');
    _.each(virtuals, function (key, i) {
      var val = virtuals[key];
      data[key] = this[val]();
    }.bind(this));
    return data;
  },
});