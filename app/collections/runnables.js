var _ = require('underscore');
var Runnable = require('../models/runnable');
var Base = require('./base');

module.exports = Base.extend({
  model: Runnable
});

module.exports.id = "Runnables";