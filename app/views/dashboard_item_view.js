var utils = require('../utils');
var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'li',
  events: {
    'click .delete': 'deleteRunnable'
  },
  postHydrate: function () {
    this.$('[data-toggle=tooltip]').tooltip({
      placement: 'bottom'
    });
  },
  deleteRunnable: function () {
    var self = this;
    alertify.confirm("Are you sure you want to delete '"+this.model.get('name')+"'?", function (e) {
      if (e) {
        // user clicked "ok"
        var opts = utils.cbOpts(self.showIfError, self);
        self.model.destroy(opts);
      } else {
          // user clicked "cancel"
      }
    });
  }
});

module.exports.id = "DashboardItemView";