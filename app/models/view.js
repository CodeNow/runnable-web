var Base = require('./fs'); //!FS
var Super = Base.prototype;
var utils = require('../utils');
var _ = require('underscore');
var JSDiff = require('diff');
var keypather = require('keypather')();

module.exports = Base.extend({
  defaults: {
    type: 'view'
  },
  urlRoot: '/users/me/runnables/:containerId/views',
  url: function () {
    var base = _.result(this, 'urlRoot');
    if (this.isNew()) return base;
    return utils.pathJoin(base, encodeURIComponent(this.get('id')));
  }
});

module.exports.id = "View";