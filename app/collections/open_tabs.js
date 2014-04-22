var Model = require('../models/fs');
var Base = require('./base');

module.exports = Base.extend({
  model: Model,
  initialize: function () {}
});

module.exports.id = 'OpenTabs';