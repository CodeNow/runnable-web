var Container = require('../models/container');
var Runnables = require('./runnables');

module.exports = Runnables.extend({
  model: Container,
  url: function () {
    var userId = this.params.owner || 'me';
    return '/users/' + userId + '/runnables';
  }
});

module.exports.id = "Containers";