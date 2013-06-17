var Project = require('../models/project')
  , Base = require('./base');

module.exports = Base.extend({
  model: Project,
  url: '/runnables'
});

module.exports.id = 'Projects';