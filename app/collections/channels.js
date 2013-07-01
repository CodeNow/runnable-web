var Channel = require('../models/channel')
  , Base = require('./base');

module.exports = Base.extend({
  model: Channel,
  url: '/channels'
});

module.exports.id = 'Channels';