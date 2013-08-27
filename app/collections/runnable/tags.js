var Base = require('../base')
  , RunnableTag = require('../../models/runnable/tag')
  , Super = Base.prototype
  , _ = require('underscore');

module.exports = Base.extend({
  model: RunnableTag,
  urlRoot: function () {
    return '/users/me/runnables/:runnableId/tags'.replace(':runnableId', this.options.runnableId);
  }
});

module.exports.id = "RunnableTags";