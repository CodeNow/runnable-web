var RendrBase = require('rendr/shared/base/model');
var _ = require('underscore');
var Super = RendrBase.prototype;

module.exports = RendrBase.extend({
  idAttribute: '_id',
  virtuals: {},
  initialize: function (attrs, options) {
    Super.initialize.apply(this, arguments);
    if (options) {
      _.extend(this, _.pick(options, 'urlRoot'));
    }
  },
  parse: function (response) {
    if (this.debugParse) {
      console.log(response);
    }
    return Super.parse.apply(this, arguments);
  },
  toJSON: function () {
    var data = Super.toJSON.call(this);
    var virtuals = _.result(this, 'virtuals');
    for (var key in virtuals) {
      var val = virtuals[key];
      data[key] = this[val]();
    }
    return data;
  }
});