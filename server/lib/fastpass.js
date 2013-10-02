var config = require('./env').current;
var FastPass = require('fastpass')
var _ = require('underscore');

var baseOpts = config.getsatisfaction;
baseOpts.domain = config.rendrApp.domain;

module.exports = function (user) {
  var opts = _.clone(baseOpts);

  _.extend(opts, {
    email : user.email,
    name  : user.name,
    unique_identifier: user._id
    // is_secure?
  });

  return new FastPass(opts);
};