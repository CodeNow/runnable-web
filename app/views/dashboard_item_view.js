var utils = require('../utils');
var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'li',
  events: {
    'click .delete': 'deleteRunnable'
  },
  deleteRunnable: function () {
    var opts = utils.cbOpts(this.showIfError, this);
    this.model.destroy(opts);
  }
});

module.exports.id = "DashboardItemView";