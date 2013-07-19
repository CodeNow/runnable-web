var Base = require('./base');
var _ = require('underscore');

module.exports = Base.extend({
  initialize: function (options) {
    _.extend(this, _.pick(options, 'containerId'));
  },
  url  : function () {
    return '/users/me/runnables/:containerId/sync'
      .replace(':containerId', this.containerId);
  }
});

module.exports.id = "FilesSync";