var Base = require('./base');
var Admin = require('../models/admin');

module.exports = Base.extend({
  model: Admin,
  url: '/admin/runnables/active'
});
module.exports.id = 'Admin';  
