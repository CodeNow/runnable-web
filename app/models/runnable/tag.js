var Base = require('../base');

module.exports = Base.extend({
  urlRoot: function () {
    return '/users/me/runnables/:runnableId/tags'.replace(':runnableId', this.options.runnableId);
  }
});

module.exports.id = "RunnableTag";