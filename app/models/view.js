var Base = require('./fs'); //!FS
var Super = Base.prototype;
var utils = require('../utils');
var _ = require('underscore');
var JSDiff = require('diff');
var keypather = require('keypather')();

module.exports = Base.extend({
  defaults: {
    type: 'view'
  }
});

module.exports.id = "View";