var RendrBase = require('rendr/shared/base/model');
var _ = require('underscore');
var Super = RendrBase.prototype;

module.exports = RendrBase.extend({
  idAttribute: '_id',
  virtual: {},
  virtuals: {},
  initialize: function (attrs, options) {
    Super.initialize.apply(this, arguments);
    if (options) {
      _.extend(this, _.pick(options, 'urlRoot'));
    }
    // this.initVirtuals();
  },
  parse: function (response) {
    if (this.debugParse) {
      console.log(response);
    }
    return Super.parse.apply(this, arguments);
  },
  increment: function (attr, cb, ctx) {
    var utils = require('../utils');
    cb = cb || utils.noop;
    var opts = utils.cbOpts(cb, ctx);
    opts.type = "POST";
    opts.data = "";
    opts.url = utils.pathJoin(_.result(this, 'urlRoot'), attr);
    this.save({}, opts);
  }
});

module.exports.id = 'Base';