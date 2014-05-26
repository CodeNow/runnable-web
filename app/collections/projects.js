var Project = require('../models/project');
var Base = require('./base');

module.exports = Runnables.extend({
  model: Project,
  url: '/projects'
});

module.exports.id = "Project";